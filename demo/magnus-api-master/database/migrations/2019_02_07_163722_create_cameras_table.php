<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCamerasTable extends Migration
{
    public function up()
    {
        Schema::create('cameras', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->macAddress('camera_address');
            $table->unsignedInteger('building_id');
            $table->string('token')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('cameras');
    }
}
