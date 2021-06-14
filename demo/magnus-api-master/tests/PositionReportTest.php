<?php

use App\Camera;
use App\Person;
use App\Repositories\PositionReportsRepository;
use Laravel\Lumen\Testing\DatabaseMigrations;

class PositionReportTest extends TestCase
{
    use DatabaseMigrations;

    private $person;
    private $camera;

    public function setUp()
    {
        parent::setUp();

        $this->withoutMiddleware();

        $this->person = factory(Person::class)->create();

        $this->camera = factory(Camera::class)->create();
    }

    /** @test */
    public function a_positive_position_report_can_be_created()
    {
        $this->mockRepository('success');

        $this->json('POST', route('reports.success'), [
            'person_id'  => $this->person->id,
            'camera_id'  => $this->camera->id,
        ])->assertResponseStatus(201);
    }

    /** @test */
    public function an_unidentified_position_report_can_be_created()
    {
        $this->mockRepository('unsuccessful');

        $this->json('POST', route('reports.unsuccessful'), [
            'person_id'  => $this->person->id,
            'camera_id'  => $this->camera->id,
        ])->assertResponseStatus(201);
    }

    private function mockRepository($methodName)
    {
        $repository = \Mockery::mock(PositionReportsRepository::class);
        $repository->shouldReceive($methodName)->once();

        return app()->instance(PositionReportsRepository::class, $repository);
    }
}
