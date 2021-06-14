<?php

use App\Building;
use App\Camera;
use Laravel\Lumen\Testing\DatabaseMigrations;

class CameraTest extends TestCase
{
    use DatabaseMigrations;

    protected $camera;

    public function setUp()
    {
        parent::setUp();

        $this->disableMiddleware();

        $this->camera = factory(Camera::class)->create();
    }

    /** @test */
    public function all_of_the_camera_can_be_retrieved()
    {
        $this->json('GET', route('camera.all'))
            ->seeJsonStructure(['data' => ['cameras']])->assertResponseStatus(200);
    }

    /** @test */
    public function a_camera_can_be_found_by_its_token()
    {
        $this->assertNotNull($this->camera->findByToken($this->camera->token));
    }

    /** @test */
    public function a_camera_can_be_registered()
    {
        $building = factory(Building::class)->create();

        $this->json('POST', route('camera.register'), [
            'name'           => 'Camera in Location',
            'camera_address' => '78-45-C4-B8-9C-A4',
            'building_id'    => $building->id,
        ])->seeHeader('Location')->assertResponseStatus(201);

        $this->seeInDatabase('cameras', [
            'name'           => 'Camera in Location',
            'camera_address' => '78-45-C4-B8-9C-A4',
        ]);
    }

    /** @test */
    public function details_on_a_camera_can_be_retrieved()
    {
        $this->json('GET', route('camera.show', ['id' => $this->camera->id]))
            ->seeJsonStructure(['data' => ['camera']])->assertResponseStatus(200);

        $this->json('GET', route('camera.show', ['id' => 180]))
            ->assertResponseStatus(404);
    }

    /** @test */
    public function a_camera_has_its_building_listed_on_retrieve()
    {
        $this->json('GET', route('camera.show', ['id' => $this->camera->id]))
            ->seeJsonStructure(['data' => ['camera', 'building']]);
    }
}
