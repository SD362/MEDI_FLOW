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
        Schema::table('appointments', function (Blueprint $table) {
            // Adding clinical fields to store doctor's report
            $table->text('diagnosis')->nullable()->after('status');
            $table->text('prescription')->nullable()->after('diagnosis');
            $table->text('notes')->nullable()->after('prescription'); // Private clinical notes
            $table->date('next_visit_date')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Dropping the columns if we rollback
            $table->dropColumn(['diagnosis', 'prescription', 'notes', 'next_visit_date']);
        });
    }
};
