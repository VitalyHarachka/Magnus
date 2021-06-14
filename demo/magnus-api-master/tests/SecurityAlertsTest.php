<?php

use App\Camera;
use App\SecurityAlert;
use Laravel\Lumen\Testing\DatabaseMigrations;

class SecurityAlertsTest extends TestCase
{
    use DatabaseMigrations;

    protected $camera;

    public function setUp()
    {
        parent::setUp();

        $this->camera = factory(Camera::class)->create();

        $this->alert = factory(SecurityAlert::class)->create();

        $this->disableMiddleware();

        \Carbon\Carbon::setTestNow();
    }

    /** @test */
    public function a_list_of_security_alerts_can_be_fetched()
    {
        $this->json('GET', route('security.alert.index'))
            ->seeJsonStructure(['data' => ['alerts']]);
    }

    /** @test */
    public function a_security_alert_can_be_created()
    {
        $this->json('POST', route('security.alert.store'), [
            'camera_id' => $this->camera->id,
        ])->assertResponseStatus(201);
    }

    /** @test */
    public function an_alert_can_be_marked_as_actioned()
    {
        $this->alert->mark();

        $this->assertNotNull($this->alert->actioned_at);
    }

    /** @test */
    public function a_security_alert_can_be_marked_as_actioned()
    {
        $this->json('PATCH', route('security.alert.mark', ['id' => $this->alert->id]))
            ->assertResponseStatus(200);

        $this->assertNotNull($this->alert->fresh()->actioned_at);
    }

    /** @test */
    public function security_alerts_can_be_listed()
    {
        $this->json('GET', route('security.alert.show', ['id' => $this->alert->id]))
            ->seeJsonStructure(['data' => ['alert']])->assertResponseStatus(200);

        $this->json('GET', route('security.alert.show', ['id' => -1]))
            ->assertResponseStatus(404);
    }

    /** @test */
    public function security_alerts_can_be_listed_by_camera()
    {
        $this->json('GET', route('security.alert.show.camera', ['camera' => $this->camera->id]))
            ->seeJsonStructure(['data' => ['alerts']]);
    }
}
