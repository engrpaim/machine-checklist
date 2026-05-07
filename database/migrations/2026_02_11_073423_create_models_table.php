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
        Schema::create('models', function (Blueprint $table) {
            $table->id();
            $table->string('model')->unique();
            $table->decimal('barelling_target')->nullable();
            $table->decimal('barelling_min')->nullable();
            $table->decimal('barelling_max')->nullable();
            $table->decimal('chamfer_barelling_target')->nullable();
            $table->decimal('chamfer_barelling_min')->nullable();
            $table->decimal('chamfer_barelling_max')->nullable();
            $table->enum('chamfer_type', ['REF. VAL.', 'R- CHAMFER', 'C- CHAMFER'])
                ->default('R- CHAMFER');
            $table->decimal('cghl_target')->nullable();
            $table->decimal('cghl_max')->nullable();
            $table->decimal('cghl_min')->nullable();
            $table->decimal('lappingt_target')->nullable();
            $table->decimal('lappingt_max')->nullable();
            $table->decimal('lappingt_min')->nullable();
            $table->decimal('flatness_lapping')->nullable();
            $table->decimal('parallelism_lapping')->nullable();
            $table->decimal('height_lapping')->nullable();
            $table->decimal('slicing_target')->nullable();
            $table->decimal('slicing_max')->nullable();
            $table->decimal('slicing_min')->nullable();
            $table->timestamps();

            $table->index(['id', 'model', 'updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('models');
    }
};
