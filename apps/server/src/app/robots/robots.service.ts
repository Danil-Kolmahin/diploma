import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RobotsEntity, RobotsHistoryEntity } from './robots.entity';
import { CommonEntity } from '../common/common.entity';
import { BASE_CHROMOSOME, DEFAULT_OPTIONS, MAX_32BIT_INT, RobotsChromosome } from '@diploma-v2/common/constants-common';
import { ComparisonsEntity } from '../comparison/comparison.entity';
import { UsersService } from '../users/users.service';
import { makeGeneticCycle } from '@diploma-v2/common/artificial-intelligence';

@Injectable()
export class RobotsService {
  public readonly DEFAULT_ROBOT_ID = '5abf9d95-040a-46d0-9065-a72a7bd8be08';
  public DEFAULT_ROBOT: RobotsEntity;

  constructor(
    @InjectRepository(RobotsEntity)
    private readonly robotsRepository: Repository<RobotsEntity>,
    @InjectRepository(RobotsHistoryEntity)
    private readonly robotsHistoryRepository: Repository<RobotsHistoryEntity>,
    private readonly usersService: UsersService,
  ) {
    this.createDefaultRobot().then();
  }

  private async createDefaultRobot(): Promise<void> {
    this.DEFAULT_ROBOT = await this.robotsRepository.save({
      id: this.DEFAULT_ROBOT_ID,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      createdBy: await this.usersService.findOneById(this.usersService.DEFAULT_SYSTEM_USER_ID),
      name: 'DEFAULT_ROBOT',
      body: BASE_CHROMOSOME,
      growable: false,
    });
  }

  async createOne(robot: Omit<RobotsEntity, keyof CommonEntity>): Promise<RobotsEntity> {
    return this.robotsRepository.save(robot);
  }

  async updateOne(
    prevRobot: RobotsEntity,
    newRobot: { name?: string, body?: RobotsChromosome },
  ): Promise<RobotsEntity> {
    await this.robotsHistoryRepository.save({ ...prevRobot, currentVersion: prevRobot });
    for (const [key, value] of Object.entries(newRobot)) {
      prevRobot[key] = value;
    }
    return this.robotsRepository.save(prevRobot);
  }

  async findOneById(id: string): Promise<RobotsEntity | null> {
    return this.robotsRepository.findOne({
      where: { id }, relations: ['createdBy'],
    });
  }

  async findAllHistoryByRobotPG(robot: RobotsEntity, {
    skip = 0,
    limit = MAX_32BIT_INT,
  } = {}): Promise<RobotsHistoryEntity[]> {
    return this.robotsHistoryRepository.find({
      where: { currentVersion: robot },
      skip, take: limit,
      relations: ['createdBy', 'currentVersion'],
      order: { createdAt: 'DESC' },
    });
  }

  async growOneById(
    robot: RobotsEntity,
    comparison: ComparisonsEntity,
    rightResult: number,
  ): Promise<RobotsEntity> {
    const prevRobots = await this
      .findAllHistoryByRobotPG(robot, { limit: 5 }); // todo make const
    return this.updateOne(robot, {
      ...robot,
      body: await makeGeneticCycle(
        [robot.body, ...(prevRobots.map(r => r.body))],
        comparison.results,
        rightResult,
        DEFAULT_OPTIONS, // todo use users options
      ) as RobotsChromosome,
    });
  }

  async findAll(): Promise<RobotsEntity[]> {
    return this.robotsRepository.find();
  }
}
