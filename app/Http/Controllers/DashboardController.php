<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                    'permissions' => auth()->user()->getAllPermissions()->map(fn($permission) => [
                        'name' => $permission->name
                    ])
                ]
            ]
        ]);
    }
}
