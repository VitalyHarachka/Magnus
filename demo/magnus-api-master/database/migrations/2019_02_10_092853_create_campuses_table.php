<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCampusesTable extends Migration
{
    public function up()
    {
        Schema::create('campuses', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('address');
            $table->string('city');
            $table->string('county');
            $table->string('postcode');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('campuses');
    }
}
