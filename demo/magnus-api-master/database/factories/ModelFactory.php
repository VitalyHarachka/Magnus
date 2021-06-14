<?php

use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name_first' => $faker->firstName,
        'name_last'  => $faker->lastName,
        'username'   => $faker->name,
        'email'      => $faker->email,
        'token'      => str_random(32),
        'password'   => Hash::make('secret'),
    ];
});

$factory->define(App\Camera::class, function (Faker\Generator $faker) {
    return [
        'name'           => $faker->name,
        'camera_address' => $faker->macAddress,
        'building_id'    => factory(App\Building::class)->create()->id,
        'token'          => str_random(32),
    ];
});

$factory->define(App\Building::class, function (Faker\Generator $faker) {
    return [
        'name'      => $faker->name,
        'campus_id' => factory(App\Campus::class),
    ];
});

$factory->define(App\Campus::class, function (Faker\Generator $faker) {
    return [
        'name'     => $faker->name,
        'address'  => $faker->streetAddress,
        'city'     => $faker->city,
        'county'   => $faker->country,
        'postcode' => $faker->postcode,
    ];
});

$factory->define(App\Person::class, function (Faker\Generator $faker) {
    return [
        'type_id' => factory(App\PersonType::class),
    ];
});

$factory->define(App\PersonType::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
    ];
});

$factory->define(App\Course::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'code' => $faker->word,
    ];
});

$factory->define(App\Student::class, function (Faker\Generator $faker) {
    return [
        'identifier' => $faker->word,
        'name_first' => $faker->firstName,
        'name_last'  => $faker->lastName,
        'course_id'  => factory(App\Course::class),
        'dob'        => $faker->date,
        'gender'     => $faker->word,
        'start_year' => $faker->year,
    ];
});

$factory->define(App\SecurityAlert::class, function () {
    return [
        'camera_id' => factory(App\Camera::class),
        'timestamp' => \Carbon\Carbon::now(),
    ];
});
