import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ModGroup } from 'src/mod-group/mod-group.entity';
import { Mod } from 'src/mod/mod.entity';
import { REPO } from 'src/utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @Inject(REPO.COURSE)
    private courseRepository: typeof Course
  ) { }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.findAll<Course>();
  }

  async find(id: string): Promise<Course> {
    const course = await this.courseRepository.findByPk<Course>(id, {
      include: [Mod, ModGroup]
    });

    if (!course) {
      throw new HttpException(
        `Course ${id} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return course;
  }

  async create(createDto: CreateCourseDto): Promise<Course> {
    const course = new Course();
    course.id = uuidv4();
    course.name = createDto.name;
    course.description = createDto.description;

    return course.save();
  }

  async delete(id: string): Promise<Course> {
    const course = await this.find(id);
    await course.destroy();
    return course;
  }
}
