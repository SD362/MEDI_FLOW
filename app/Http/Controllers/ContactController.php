<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Redirect;

class ContactController extends Controller
{
    // Handle the form submission
    public function store(Request $request)
    {
        // Validate the input
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Save to database
        ContactMessage::create($validated);

        // Redirect back with success message (Inertia flash)
        return Redirect::back()->with('message', 'Inquiry dispatched successfully to the Support Hub.');
    }

    // (Optional) Mark as read for Admin
    public function markAsRead($id)
    {
        ContactMessage::findOrFail($id)->update(['is_read' => true]);
        return Redirect::back();
    }

    /**
     * ✅ ADDED: Action to remove a system inquiry.
     * This handles the DELETE request from the Admin Dashboard.
     */
    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();

        return Redirect::back()->with('message', 'Inquiry purged from system archives.');
    }
}
