<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
        /**
     * Helper: Generates a Google Maps search URL based on the hospital name and address.
     */
    public function getGoogleMapsUrl()
    {
        // Encodes the name and address for a valid URL search query
        $query = urlencode($this->name . ' ' . ($this->address ?? ''));
        return "https://www.google.com/maps/search/?api=1&query={$query}";
    }
}
