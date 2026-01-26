<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class HospitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Disable Foreign Key Checks to allow truncation
        Schema::disableForeignKeyConstraints();

        // 2. Clear existing data
        DB::table('hospitals')->truncate();

        // 3. Re-enable Foreign Key Checks
        Schema::enableForeignKeyConstraints();

        $hospitals = [
            // --- NATIONAL & TEACHING HOSPITALS ---
            ['name' => 'National Hospital of Sri Lanka (Colombo)', 'location' => 'Colombo'],
            ['name' => 'National Hospital Kandy', 'location' => 'Kandy'],
            ['name' => 'Colombo South Teaching Hospital (Kalubowila)', 'location' => 'Kalubowila'],
            ['name' => 'Colombo North Teaching Hospital (Ragama)', 'location' => 'Ragama'],
            ['name' => 'Teaching Hospital Karapitiya', 'location' => 'Galle'],
            ['name' => 'Teaching Hospital Jaffna', 'location' => 'Jaffna'],
            ['name' => 'Teaching Hospital Peradeniya', 'location' => 'Peradeniya'],
            ['name' => 'Teaching Hospital Anuradhapura', 'location' => 'Anuradhapura'],
            ['name' => 'Teaching Hospital Batticaloa', 'location' => 'Batticaloa'],
            ['name' => 'Teaching Hospital Kurunegala', 'location' => 'Kurunegala'],
            ['name' => 'Teaching Hospital Ratnapura', 'location' => 'Ratnapura'],
            ['name' => 'Sri Jayewardenepura General Hospital', 'location' => 'Nugegoda'],

            // --- SPECIALIZED HOSPITALS ---
            ['name' => 'Lady Ridgeway Hospital for Children (LRH)', 'location' => 'Colombo'],
            ['name' => 'Castle Street Hospital for Women', 'location' => 'Colombo'],
            ['name' => 'De Soysa Hospital for Women', 'location' => 'Colombo'],
            ['name' => 'Apeksha Hospital (National Cancer Institute)', 'location' => 'Maharagama'],
            ['name' => 'National Eye Hospital', 'location' => 'Colombo'],
            ['name' => 'National Dental Hospital', 'location' => 'Colombo'],
            ['name' => 'National Institute of Mental Health', 'location' => 'Angoda'],

            // --- DISTRICT GENERAL HOSPITALS ---
            ['name' => 'District General Hospital Gampaha', 'location' => 'Gampaha'],
            ['name' => 'District General Hospital Negombo', 'location' => 'Negombo'],
            ['name' => 'District General Hospital Kalutara', 'location' => 'Kalutara'],
            ['name' => 'District General Hospital Matara', 'location' => 'Matara'],
            ['name' => 'District General Hospital Hambantota', 'location' => 'Hambantota'],
            ['name' => 'District General Hospital Nuwara Eliya', 'location' => 'Nuwara Eliya'],
            ['name' => 'District General Hospital Matale', 'location' => 'Matale'],
            ['name' => 'District General Hospital Badulla', 'location' => 'Badulla'],
            ['name' => 'District General Hospital Monaragala', 'location' => 'Monaragala'],
            ['name' => 'District General Hospital Polonnaruwa', 'location' => 'Polonnaruwa'],
            ['name' => 'District General Hospital Trincomalee', 'location' => 'Trincomalee'],
            ['name' => 'District General Hospital Ampara', 'location' => 'Ampara'],
            ['name' => 'District General Hospital Vavuniya', 'location' => 'Vavuniya'],
            ['name' => 'District General Hospital Mannar', 'location' => 'Mannar'],
            ['name' => 'District General Hospital Kilinochchi', 'location' => 'Kilinochchi'],
            ['name' => 'District General Hospital Mullaitivu', 'location' => 'Mullaitivu'],
            ['name' => 'District General Hospital Chilaw', 'location' => 'Chilaw'],

            // --- BASE HOSPITALS ---
            ['name' => 'Base Hospital Homagama', 'location' => 'Homagama'],
            ['name' => 'Base Hospital Panadura', 'location' => 'Panadura'],
            ['name' => 'Base Hospital Avissawella', 'location' => 'Avissawella'],
            ['name' => 'Base Hospital Horana', 'location' => 'Horana'],
            ['name' => 'Base Hospital Wattala', 'location' => 'Wattala'],
        ];

        foreach ($hospitals as $hospital) {
            DB::table('hospitals')->insert([
                'name' => $hospital['name'],
                'address' => $hospital['location'],
                // ✅ ADDED: Generic placeholder number to satisfy database requirement
                'contact_number' => '011-2691111', 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}