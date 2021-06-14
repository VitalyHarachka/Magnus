<?php

use App\Person;
use App\PersonType;
use Laravel\Lumen\Testing\DatabaseMigrations;

class PersonTest extends TestCase
{
    use DatabaseMigrations;

    protected $person;
    protected $personType;

    public function setUp()
    {
        parent::setUp();

        $this->withoutMiddleware();

        $this->person = factory(Person::class)->create();

        $this->personType = factory(PersonType::class)->create();
    }

    /** @test */
    public function a_person_has_a_type()
    {
        $this->assertNotNull($this->person->type);
    }

    /** @test */
    public function a_type_has_many_people()
    {
        $this->person->type()->associate($this->personType);

        $this->assertNotNull($this->personType->people);
    }

    /** @test */
    public function a_person_has_position_reports()
    {
        $this->assertNotNull($this->person->reports);
    }

    /** @test */
    public function a_person_type_can_be_created()
    {
        $this->json('POST', route('person.type.store'), [
            'name' => 'Type Name Testing',
        ])->seeHeader('Location')->assertResponseStatus(201);
    }

    /** @test */
    public function a_person_type_can_be_viewed()
    {
        $this->json('GET', route('person.type.show', ['id' => $this->personType->id]))
            ->seeJsonStructure(['data' => ['type']]);
    }

    /** @test */
    public function a_person_can_be_created()
    {
        $this->json('POST', route('person.store'), [
            'identifier' => 'N0727303',
            'type_id'    => factory(PersonType::class)->create()->id,
        ])->seeHeader('Location')->assertResponseStatus(201);
    }

    /** @test */
    public function a_person_can_be_retrieved()
    {
        $this->json('GET', route('person.show', ['id' => $this->person->id]))
            ->seeJsonStructure(['data' => ['person']])->assertResponseOk();
    }

    /** @test */
    public function a_list_of_people_of_a_type_can_be_retrieved()
    {
        $this->json('GET', route('person.type.list', ['id' => $this->personType->id]))
            ->seeJsonStructure(['data' => ['type' => ['people']]])->assertResponseOk();
    }
}
