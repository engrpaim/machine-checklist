<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     *
     * Run the migrations.
     *
     **/
    public function up(): void
    {
        Schema::table('models', function (Blueprint $table) {
            $table->string('chamfer_point1_data')->nullable();
            $table->string('chamfer_point2_data')->nullable();
            $table->decimal('slicing_points')->nullable();
            $table->decimal('lapping_points')->nullable();
            $table->decimal('cghl_points')->nullable();
        });
    }

    /**
     *
     * Reverse the migrations.
     *
     **/
    public function down(): void
    {
        Schema::table('models', function (Blueprint $table) {
            //
        });
    }
};
