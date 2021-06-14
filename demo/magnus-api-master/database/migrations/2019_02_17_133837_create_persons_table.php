<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePersonsTable extends Migration
{
    public function up()
    {
        Schema::create('people', function (Blueprint $table) {
            $table->increments('id');
            $table->string('identifier')->nullable()->unique();
            $table->unsignedInteger('type_id');
            $table->timestamps();
        });

        Schema::create('persons_type', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
        });
    }

    public function down()
    {
        Schema::drop('people');
        Schema::drop('persons_type');
    }
}
