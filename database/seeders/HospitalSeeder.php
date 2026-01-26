<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HospitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        DB::table('hospitals')->delete();

        $hospitals = [
            // --- NATIONAL HOSPITALS ---
            ['name' => 'National Hospital of Sri Lanka', 'address' => 'Colombo 10', 'contact_number' => '011-2691111'],
            ['name' => 'National Hospital Kandy', 'address' => 'Kandy', 'contact_number' => '081-2222261'],
            ['name' => 'National Institute of Mental Health', 'address' => 'Angoda', 'contact_number' => '011-2578234'],
            ['name' => 'National Eye Hospital', 'address' => 'Colombo 10', 'contact_number' => '011-2693911'],
            ['name' => 'Lady Ridgeway Hospital for Children', 'address' => 'Colombo 08', 'contact_number' => '011-2693711'],
            ['name' => 'Castle Street Hospital for Women', 'address' => 'Colombo 08', 'contact_number' => '011-2696231'],
            ['name' => 'De Soysa Hospital for Women', 'address' => 'Colombo 08', 'contact_number' => '011-2696224'],
            ['name' => 'Apeksha Hospital (Cancer Institute)', 'address' => 'Maharagama', 'contact_number' => '011-2850252'],

            // --- TEACHING HOSPITALS ---
            ['name' => 'Colombo South Teaching Hospital', 'address' => 'Kalubowila', 'contact_number' => '011-2822261'],
            ['name' => 'Colombo North Teaching Hospital', 'address' => 'Ragama', 'contact_number' => '011-2959261'],
            ['name' => 'Teaching Hospital Karapitiya', 'address' => 'Galle', 'contact_number' => '091-2232176'],
            ['name' => 'Teaching Hospital Peradeniya', 'address' => 'Peradeniya', 'contact_number' => '081-2388001'],
            ['name' => 'Teaching Hospital Jaffna', 'address' => 'Jaffna', 'contact_number' => '021-2222306'],
            ['name' => 'Teaching Hospital Batticaloa', 'address' => 'Batticaloa', 'contact_number' => '065-2222261'],
            ['name' => 'Teaching Hospital Anuradhapura', 'address' => 'Anuradhapura', 'contact_number' => '025-2222261'],
            ['name' => 'Teaching Hospital Kurunegala', 'address' => 'Kurunegala', 'contact_number' => '037-2222261'],
            ['name' => 'Sri Jayawardenepura General Hospital', 'address' => 'Nugegoda', 'contact_number' => '011-2778610'],

            // --- DISTRICT GENERAL HOSPITALS (DGH) ---
            ['name' => 'District General Hospital Gampaha', 'address' => 'Gampaha', 'contact_number' => '033-2222261'],
            ['name' => 'District General Hospital Negombo', 'address' => 'Negombo', 'contact_number' => '031-2222261'],
            ['name' => 'District General Hospital Kalutara', 'address' => 'Kalutara', 'contact_number' => '034-2222261'],
            ['name' => 'District General Hospital Matara', 'address' => 'Matara', 'contact_number' => '041-2222261'],
            ['name' => 'District General Hospital Hambantota', 'address' => 'Hambantota', 'contact_number' => '047-2220261'],
            ['name' => 'District General Hospital Polonnaruwa', 'address' => 'Polonnaruwa', 'contact_number' => '027-2222261'],
            ['name' => 'District General Hospital Badulla', 'address' => 'Badulla', 'contact_number' => '055-2222261'],
            ['name' => 'District General Hospital Monaragala', 'address' => 'Monaragala', 'contact_number' => '055-2276261'],
            ['name' => 'District General Hospital Ratnapura', 'address' => 'Ratnapura', 'contact_number' => '045-2222261'],
            ['name' => 'District General Hospital Kegalle', 'address' => 'Kegalle', 'contact_number' => '035-2222261'],
            ['name' => 'District General Hospital Matale', 'address' => 'Matale', 'contact_number' => '066-2222261'],
            ['name' => 'District General Hospital Nuwara Eliya', 'address' => 'Nuwara Eliya', 'contact_number' => '052-2222261'],
            ['name' => 'District General Hospital Trincomalee', 'address' => 'Trincomalee', 'contact_number' => '026-2222261'],
            ['name' => 'District General Hospital Vavuniya', 'address' => 'Vavuniya', 'contact_number' => '024-2222261'],
            ['name' => 'District General Hospital Chilaw', 'address' => 'Chilaw', 'contact_number' => '032-2222261'],
            ['name' => 'District General Hospital Ampara', 'address' => 'Ampara', 'contact_number' => '063-2222261'],

            // --- BASE HOSPITALS (A & B) ---
            ['name' => 'Base Hospital Avissawella', 'address' => 'Avissawella', 'contact_number' => '036-2222261'],
            ['name' => 'Base Hospital Homagama', 'address' => 'Homagama', 'contact_number' => '011-2855331'],
            ['name' => 'Base Hospital Panadura', 'address' => 'Panadura', 'contact_number' => '038-2232261'],
            ['name' => 'Base Hospital Horana', 'address' => 'Horana', 'contact_number' => '034-2261261'],
            ['name' => 'Base Hospital Balapitiya', 'address' => 'Balapitiya', 'contact_number' => '091-2258261'],
            ['name' => 'Base Hospital Elpitiya', 'address' => 'Elpitiya', 'contact_number' => '091-2291261'],
            ['name' => 'Base Hospital Diyatalawa', 'address' => 'Diyatalawa', 'contact_number' => '057-2229261'],
            ['name' => 'Base Hospital Mahiyangana', 'address' => 'Mahiyangana', 'contact_number' => '055-2257261'],
            ['name' => 'Base Hospital Puttalam', 'address' => 'Puttalam', 'contact_number' => '032-2265261'],
            ['name' => 'Base Hospital Kuliyapitiya', 'address' => 'Kuliyapitiya', 'contact_number' => '037-2281261'],
            ['name' => 'Base Hospital Embilipitiya', 'address' => 'Embilipitiya', 'contact_number' => '047-2230261'],
            ['name' => 'Base Hospital Point Pedro', 'address' => 'Point Pedro', 'contact_number' => '021-2263261'],
        ];

        DB::table('hospitals')->insert($hospitals);
    }
}