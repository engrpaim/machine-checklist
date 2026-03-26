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
            $table->string('datalist_lot_number');
            $table->string('operator_name');
            $table->string('checker');
            $table->string('shift');
            $table->string('staff_engineer');
            $table->integer('batch_number');
            $table->integer('total_batch_number')->nullable();
            $table->integer('total_qty_lot')->nullable();
            $table->string('media_size')->nullable();
            $table->string('media_weight')->nullable();
            $table->string('coolant_level')->nullable();
            $table->string('styrene_powder')->nullable();
            $table->string('gc_powder')->nullable();
            $table->string('magnet_wt_pc_')->nullable();
            $table->string('chamfertype')->nullable();
            $table->enum('status', ['preparing', 'prepared', 'measuring', 'measured', 'approved'])->default('preparing');
            $table->json('magnet')->nullable();
            $table->json('points')->nullable();
            $table->json('time_setting')->nullable();

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
        Schema::dropIfExists('barellings');
    }
};
