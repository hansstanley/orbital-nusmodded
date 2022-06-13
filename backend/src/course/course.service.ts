import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ModGroup } from 'src/mod-group/mod-group.entity';
import { Mod } from 'src/mod/mod.entity';
import { ModService } from 'src/mod/mod.service';
import { REPO } from 'src/utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import {
  BindModsDto,
  CreateCourseDto,
  UnbindModsDto,
  UpdateCourseDto
} from './dto';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @Inject(REPO.COURSE)
    private courseRepository: typeof Course,
    private readonly modService: ModService
  ) { }

  /**
   * Retrieves all Courses.
   * 
   * @returns An array of all Courses.
   */
  async findAll(): Promise<Course[]> {
    return this.courseRepository.findAll<Course>();
  }

  /**
   * Retrieves a Course given its UUID.
   * 
   * @param id The UUID of the Course.
   * @returns The corresponding Course.
   */
  async find(id: string): Promise<Course> {
    const course = await this.courseRepository
      .findByPk<Course>(id);

    if (!course) {
      throw new HttpException(
        `Course ${id} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return course;
  }

  /**
   * Creates a Course.
   * 
   * @param createDto DTO to create a Course.
   * @returns The created Course.
   */
  async create(createDto: CreateCourseDto): Promise<Course> {
    const existing = await this.courseRepository.findOne({
      where: { title: createDto.title }
    });

    if (existing) {
      throw new HttpException(
        `Course with title '${createDto.title}' already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    const course = new Course();
    course.id = uuidv4();

    for (let key in createDto) {
      if ((createDto[key] ?? false) && key in course) {
        course[key] = createDto[key];
      }
    }

    return course.save();
  }

  /**
   * Updates a course.
   * 
   * @param updateDto DTO to update a Course.
   * @returns The updated Course.
   */
  async update(id: string, updateDto: UpdateCourseDto): Promise<Course> {
    const course: Course = await this.find(id);

    for (let key in updateDto) {
      if ((updateDto[key] ?? false) && key in course) {
        course[key] = updateDto[key];
      }
    }

    return course.save();
  }

  /**
   * Deletes a Course.
   * 
   * @param id The UUID of the Course.
   * @returns The deleted Course.
   */
  async delete(id: string): Promise<Course> {
    const course = await this.find(id);
    await course.destroy();
    return course;
  }

  /**
   * Binds Mods to a Course.
   * 
   * @param course The Course to bind Mods to.
   * @param bindModsDto DTO for Mod binding.
   * @returns An array of module codes from bound Mods.
   */
  async bindMods(
    course: Course,
    bindModsDto: BindModsDto
  ): Promise<string[]> {
    const { type, moduleCodes } = bindModsDto;

    const mods: Mod[] = await Promise.all(
      moduleCodes.map((code) => this.modService.find(code))
    );

    const passed: string[] = await Promise.all(mods
      .filter((mod) => mod ?? false)
      .map(async (mod) => {
        await course.$add('mod', mod, { through: { type } });
        return mod.moduleCode;
      }));

    return passed;
  }

  /**
   * Unbinds Mods from a Course.
   * 
   * @param course The Course to unbind Mods from.
   * @param unbindModsDto DTO for Mod unbinding.
   * @returns The number of Mods unbound.
   */
  async unbindMods(
    course: Course,
    unbindModsDto: UnbindModsDto
  ): Promise<number> {
    const { moduleCodes } = unbindModsDto;

    const count = await course.$remove('mod', moduleCodes);
    return count;
  }
}
