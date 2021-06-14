<?php

use App\Course;
use App\Student;
use Laravel\Lumen\Testing\DatabaseMigrations;

class CourseTest extends TestCase
{
    use DatabaseMigrations;

    private $course;

    public function setUp()
    {
        parent::setUp();

        $this->course = factory(Course::class)->create();

        $this->disableMiddleware();
    }

    /** @test */
    public function a_course_can_have_many_students()
    {
        $students = factory(Student::class, 3)->create(['course_id' => $this->course->id]);

        $this->assertCount(3, $this->course->students);
    }
}
