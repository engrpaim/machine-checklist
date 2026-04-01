<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cgh_models', function (Blueprint $table) {
            $table->unsignedBigInteger('datalist_id');
            $table->string('datalist_lot_number');
            $table->string('model')->nullable();
            $table->string('operator_name')->nullable();
            $table->string('checker')->nullable();
            $table->string('shift')->nullable();
            $table->string('staff_engineer')->nullable();
            $table->string('technician_gl')->nullable();
            $table->integer('batch_number')->nullable();
            $table->string('machine_number')->nullable();
            $table->string('upper_conveyor_speed')->nullable();
            $table->string('lower_conveyor_speed')->nullable();
            $table->string('carrier_speed')->nullable();
            $table->string('auto_cylinder_forward_speed')->nullable();
            $table->string('auto_cylinder_moving_distance')->nullable();
            $table->string('micrometer_serial_number')->nullable();
            $table->json('mass_pro')->nullable();
            $table->json('perpendicularity')->nullable();
            $table->enum('status', ['preparing', 'prepared', 'measuring', 'measured', 'approved'])->default('preparing');
            $table->timestamps();

            //Composite Foreign Key
            $table->foreign(['datalist_id'])
                ->references(['id'])
                ->on('datalists')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cgh_models');
    }
};
