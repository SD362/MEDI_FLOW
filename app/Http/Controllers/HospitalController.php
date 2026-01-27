<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
        ]);

        Hospital::create($request->all());

        return redirect()->back()->with('message', 'New facility registered successfully!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
        ]);

        Hospital::findOrFail($id)->update($request->all());

        return redirect()->back()->with('message', 'Facility details updated!');
    }

    public function destroy($id)
    {
        Hospital::findOrFail($id)->delete();
        return redirect()->back()->with('message', 'Facility removed from system.');
    }
}
