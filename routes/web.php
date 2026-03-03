<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachiningChecklistController;
use Inertia\Inertia;
use App\Models\models;

//Current is getting the route then pass the data
// bad pracctice it can cause data overload URL must be changing
// Route::get('/machining-checklist', function () {
//         $models = models::all('*');
//         $modified =[];
//         foreach(   $models as  $key => $values){

//             $data = $values->toArray();

//             $modified[$data["model"]] =    $data;


//         }
//         $finalModel = json_encode($modified);
//         return Inertia::render('Home', [
//         'message' => 'Hello from Laravel!',
//         'modelsList' =>  $finalModel
//         ]);
// })->name('machining-checklist');


// Route::post('/machining-checklist', [MachiningChecklistController::class, 'inprocess']);
// Route::post('/machining-checklist/update',[MachiningChecklistController::class, 'update']);
// Route::post('/machining-checklist/user/create',[MachiningChecklistController::class,'saveManage'])->name('create-user');
// Route::put('/machining-checklist/user/update',
//     [MachiningChecklistController::class,'updateManager']
// )->name('user.update');

// Route::put('/machining-checklist/user/check',
//     [MachiningChecklistController::class,'checkExist']
// )->name('user.check');
// //

// Route::delete('/machining-checklist/user/delete',
//     [MachiningChecklistController::class,'destroy']
// )->name('user.delete');

// Route::get('/machining-checklist/user/create', function () {
//     return Inertia::render('Home');
// })->name('user.create');

// Route::get('/machining-checklist/user/check', function () {
//     return Inertia::render('Home');
// });

// New routing
Route::get('/', function () {
    return redirect('/machining-checklist/home');
});
Route::get('/machining-checklist/home' , function (){
    return Inertia::render('Dashboard');
});

Route::get('/machining-checklist/settings' , function (){
    return Inertia::render('Settings');
});

Route::get('/machining-checklist/measure',function(){

        $models = models::all('*');
        $modified =[];
        foreach($models as  $key => $values){
            $data = $values->toArray();
            $modified[$data["model"]] =    $data;
        }

        $finalModel = json_encode($modified);

        return Inertia::render('Measure', [
            'message' => 'Hello from Laravel!',
            'modelsList' =>  $finalModel
        ]);
});

Route::post('/machining-checklist/measure/store',[MachiningChecklistController::class, 'store']);
