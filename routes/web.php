<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachiningChecklistController;
use Inertia\Inertia;

Route::get('/machining-checklist', function () {
    return Inertia::render('Home', [
        'message' => 'Hello from Laravel!'
    ]);
})->name('machining-checklist');
Route::post('/machining-checklist', [MachiningChecklistController::class, 'inprocess']);
