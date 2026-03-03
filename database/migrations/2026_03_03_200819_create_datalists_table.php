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
        Schema::create('datalists', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('lot_number');
            $table->string('shift');
            $table->string('ip_address');
            $table->json('preparing');
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
            $table->unique(['id','created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('datalists');
    }
};
