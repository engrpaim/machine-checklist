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
        Schema::create('barellings', function (Blueprint $table) {
            $table->unsignedBigInteger('datalist_id');
            $table->timestamp('datalist_created_at');
            $table->string('batch_number');
            $table->integer('total_batch_number');
            $table->integer('total_qty_lot');
            $table->string('media_size');
            $table->string('media_weight');
            $table->string('coolant_level');
            $table->string('styrene_powder');
            $table->string('gc_powder');
            $table->string('magnet_wt_pc_');
            $table->string('chamfertype');
            $table->enum('status',['preparing','prepared','measuring','measured','approved']);
            $table->json('magnet');
            $table->json('points');
            $table->json('time_setting');
            $table->timestamps();

            //Composite Foreign Key
            $table->foreign(['datalist_id', 'datalist_created_at'])
                  ->references(['id', 'created_at'])
                  ->on('datalists')
                  ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barellings');
    }
};

