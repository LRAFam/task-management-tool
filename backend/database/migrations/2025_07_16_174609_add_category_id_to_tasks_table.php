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
        // Drop the index first, then the column
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['category']); // Drop the index first
            $table->dropColumn('category'); // Then remove the old string category column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('category')->nullable()->index(); // Restore old category column
        });
    }
};
