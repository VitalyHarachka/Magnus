<?php

use App\Building;
use App\Camera;
use App\Campus;
use Laravel\Lumen\Testing\DatabaseMigrations;

class BuildingTest extends TestCase
{
    use DatabaseMigrations;

    protected $building;

    public function setUp()
    {
        parent::setUp();

        $this->app->instance('middleware.disable', true);

        $this->building = factory(Building::class)->create();
    }

    /** @test */
    public function a_building_can_be_created()
    {
        $this->json('POST', route('building.store'), [
            'name'      => 'Mary Anne Evans',
            'campus_id' => factory(Campus::class)->create()->id,
        ])->seeHeader('Location')->assertResponseStatus(201);

        $this->json('POST', route('building.store'), [
            'name'      => null,
            'campus_id' => factory(Campus::class)->create()->id,
        ])->assertResponseStatus(422);
    }

    /** @test */
    public function a_building_can_be_retrieved()
    {
        $this->json('GET', route('building.show', ['id' => $this->building->id]))
            ->seeJsonStructure(['data' => ['building' => ['cameras']]]);
    }

    /** @test */
    public function a_building_can_have_many_cameras()
    {
        $camera = factory(Camera::class)->create(['building_id' => $this->building->id]);

        $this->assertNotNull($camera->building);
        $this->assertNotNull($this->building->cameras);
    }

    /** @test */
    public function a_buildings_cameras_can_be_retrieved()
    {
        $this->json('GET', route('building.cameras', ['id' => $this->building->id]))
            ->seeJsonStructure(['data' => ['building', 'cameras']]);

        $this->json('GET', route('building.cameras', ['id' => 0]))
            ->seeJson(['error' => 'Building not found.'])->assertResponseStatus(404);
    }

    /** @test */
    public function a_building_has_a_campus()
    {
        $this->assertNotNull($this->building->campus);
    }
}
