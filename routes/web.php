<?php

use App\Http\Controllers\GoldController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\OperationalHouseController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductGoldController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\RewardSummaryController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::resource('users', UserController::class);
    Route::resource('subjects', SubjectController::class);
    Route::resource('grades', GradeController::class);
    Route::resource('operational-houses', OperationalHouseController::class);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/rewards', [RewardSummaryController::class, 'index'])->name('rewards.index');
    Route::resource('rewards', RewardController::class);
    Route::post('grades/{grade}/rewards', [RewardController::class, 'store'])->name('grades.rewards.store');
    Route::resource('golds', GoldController::class);
    Route::resource('units', UnitController::class);
    Route::resource('product-golds', ProductGoldController::class);
});

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

require __DIR__.'/auth.php';
