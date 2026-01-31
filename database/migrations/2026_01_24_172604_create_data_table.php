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
        Schema::create('data', function (Blueprint $table) {
            $table->string('model')->required();
            $table->string('process')->required();
            $table->string('lot')->required();
            $table->decimal('total_lot', 10, 2)->nullable();
            $table->decimal('qty_lot', 10, 2)->nullable();
            $table->decimal('wt_lot', 10, 2)->nullable();
            $table->string('media_size')->nullable();
            $table->string('media_weight')->nullable();
            $table->string('coolant')->nullable();
            $table->string('styrenre')->nullable();
            $table->string('gc_powder')->nullable();
            $table->string('magnet_wt')->nullable();
            $table->string('chamfer_type')->nullable();
            $table->date('date');
            $table->string('shift')->nullable();
            $table->string('operator')->nullable();
            $table->string('checker')->nullable();
            $table->string('staff_eng')->nullable();
            $table->json('barrelling')->nullable();
            $table->json('pt_data')->nullable();
            $table->json('timer')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data');
    }
};
