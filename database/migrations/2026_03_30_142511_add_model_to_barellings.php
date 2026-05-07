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
        Schema::table('barellings', function (Blueprint $table) {
            $table->string('contracer_serial')->nullable();
            $table->string('chamfer_jig_serial')->nullable();
            $table->string('total_qty_batch')->nullable();
            $table->string('micrometer_serial')->nullable();
            $table->string('total_wt_batch')->nullable();
            $table->string('model')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barellings', function (Blueprint $table) {
            //
        });
    }
};
