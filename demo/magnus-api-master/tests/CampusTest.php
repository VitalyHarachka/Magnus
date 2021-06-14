<?php

use App\Building;
use App\Campus;
use Laravel\Lumen\Testing\DatabaseMigrations;

class CampusTest extends TestCase
{
    use DatabaseMigrations;

    protected $campus;

    public function setUp()
    {
        parent::setUp();

        $this->app->instance('middleware.disable', true);

        $this->campus = factory(Campus::class)->create();
    }

    /** @test */
    public function a_campus_can_be_created()
    {
        $this->json('POST', route('campus.store'), [
            'name'     => 'Clifton Campus',
            'address'  => 'Clifton Lane',
            'city'     => 'Nottingham',
            'county'   => 'Nottinghamshire',
            'postcode' => 'NG11 8NS', ]
        )->seeHeader('Location')
            ->assertResponseStatus(201);
    }

    /** @test */
    public function a_campus_can_be_retrieved()
    {
        $this->json('GET', route('campus.show', ['id' => $this->campus->id]))
            ->assertResponseOk();
    }

    /** @test */
    public function a_campus_can_have_many_buildings()
    {
        $this->campus->buildings()->save(factory(Building::class)->create());
        $this->assertNotNull($this->campus->buildings);
    }

    /** @test */
    public function a_campuses_buildings_can_be_retrieved()
    {
        $this->json('GET', route('campus.buildings', ['id' => $this->campus->id]))
            ->seeJsonStructure(['data' => ['campus', 'buildings']]);
    }

    /** @test */
    public function campuses_can_be_retrieved()
    {
        $this->json('GET', route('campus.index'))
            ->seeJsonStructure(['data']);
    }

    /** @test */
    public function a_campuses_cameras_can_be_accessed_through_their_buildings()
    {
        $building = factory(Building::class)->create(['campus_id' => $this->campus->id]);
        $camera = factory(\App\Camera::class)->create(['building_id' => $building]);

        $this->json('GET', route('campus.show', ['id' => $this->campus->id]))
            ->seeJsonStructure(['data' => ['buildings']]);
    }
}
