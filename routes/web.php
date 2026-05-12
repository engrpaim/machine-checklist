<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashBoardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachiningChecklistController;
use Inertia\Inertia;
use App\Models\ModelDetails;
use App\Models\Datalist;
use App\Models\UserArea;
use Illuminate\Http\Request;
use Carbon\Carbon;
//Current is getting the route then pass the data
// bad pracctice it can cause data overload URL must be changing
// Route::get('/machining-checklist', function () {
//         $models = ModelDetails::all('*');
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
Route::get('/machining-checklist/home', function (Request $request) {

    //default filtering
    $clientIp = $request->ip();
    $isExistUser = false;
    
    $current_time = Carbon::now()->endOfDay();
    $yesterday_time = Carbon::yesterday()->startOfDay();
    
    if($clientIp){
         $isExistUser = UserArea::where('ip_address',$clientIp)->where('permission','Admin')->first();
    }

    $models = ModelDetails::select('model')->orderBy('id')->get();
    $modelOnly =[];
    foreach($models as $key => $value){
        array_push($modelOnly,$value["model"]);
    }

    //filtered by user

    $start = $request->get('start_date') ? Carbon::parse($request->get('start_date')):null;
    $end = $request->get('end_date') ? Carbon::parse($request->get('end_date'))->endOfDay():null;
    $lot = $request->get('lot_number')??null;
    $table = $request->get('table')??null;
    $model = $request->get('model') ? urldecode($request->get('model')):null;

    $modelList = false;
    $dataQuery =  
        [
          'start' =>  $start , 
          'end' => $end , 
          'lot_number' => $lot , 
          'model' =>$model 
        ];
     if($table){ 
        
        $filterData = Datalist::query();

        foreach($dataQuery as $key => $value){
            if($key === 'start'){
                $filtStart =  $start ?  $start : $end ;
                $filtEnd =  $end ?  $end : $start ;
                if($filtStart || $filtEnd){
                    $filterData->whereBetween('created_at',[$filtStart,$filtEnd]);
                }
            }else if( $value !== null && $key !== 'end'){
                    $filterData->where($key,$value);
                }
        }
        
      
        $modelList = $filterData->orderBy('id', 'desc')->paginate(10, ['*'], 'page-filtered') ->withQueryString();
     }
   
   
    return Inertia::render('Dashboard', [
        'modelsList' =>  $modelOnly,
        'ip_client' => $isExistUser ? $isExistUser->toArray():null,
        'allLot' =>  $modelList ? $modelList : Datalist::whereBetween('created_at',[$yesterday_time,$current_time])->orderBy('id', 'desc')->paginate(10, ['*'], 'page'),
    ]);
});

Route::get('/machining-checklist/settings', function () {
    return Inertia::render('Settings');
});

Route::get('/machining-checklist/measure', function (Request $request) {

    $models = ModelDetails::orderBy('id')->get();
    $modified = [];

    foreach ($models as  $key => $values) {
        $data = $values->toArray();
        $modified[$data["model"]] =    $data;
    }
    
    $finalModel = json_encode($modified);

    $clientIp = $request->ip();
    $isExistUser = false;

    if($clientIp){
         $isExistUser = UserArea::where('ip_address',$clientIp)->where('permission','Admin')->first();
    }
    return Inertia::render('Measure', [
        'ip_client' => $isExistUser ? $isExistUser->toArray():null,
        'message' => 'Hello from Laravel!',
        'modelsList' =>  $finalModel
    ]);
});

Route::get('/machining-checklist/admin', function (Request $request) {
    $modelSearch = $request->get('search_model');
    $ipSearch = $request->get('search_user');

    $clientIp = $request->ip();
    $checkModel = $modelSearch ? ModelDetails::where('model', 'like', "%{$modelSearch}%")->orderBy('id', 'desc')->paginate(10, ['*'], 'models') : null;
    $checkIp =  $ipSearch ? UserArea::where('ip_address', 'like', "%{$ipSearch}%")->orWhere('user_name', 'like', "%{$ipSearch}%")->orderBy('id', 'desc')->paginate(10, ['*'], 'user') : null;

    
    $modelList = $checkModel &&  count($checkModel->toArray()["data"]) > 0 ? $checkModel : ModelDetails::orderBy('id', 'desc')->paginate(10, ['*'], 'models');
    $userList = $checkIp &&  count($checkIp->toArray()["data"]) > 0 ? $checkIp : UserArea::orderBy('id', 'desc')->paginate(10, ['*'], 'user');
    $isExistUser = false;

    if($clientIp){
         $isExistUser = UserArea::where('ip_address',$clientIp)->where('permission','Admin')->first();
    }
    
    return Inertia::render('Admin', [
        'ip_client' => $isExistUser ? $isExistUser->toArray():null,
        'modelsList' => $modelList,
        'userList' => $userList
    ]);

})->name('admin.models');

//Machining
Route::post('/machining-checklist/measure/store', [MachiningChecklistController::class, 'store']);
Route::post('/machining-checklist/measure/batching', [MachiningChecklistController::class, 'lotBatching']);
Route::post('/machining-checklist/measure/get-details', [MachiningChecklistController::class, 'getDetails']);
Route::post('/machining-checklist/measure/autosave', [MachiningChecklistController::class, 'autosave']);
Route::post('/machining-checklist/measure/finalize', [MachiningChecklistController::class, 'finalizeProcess']);
Route::post('/machining-checklist/measure/proceed', [MachiningChecklistController::class, 'proceedToNext']);
Route::post('/machining-checklist/measure/update', [MachiningChecklistController::class, 'updateData']);
Route::post('/machining-checklist/measure/part-save', [MachiningChecklistController::class, 'partSave']);
Route::post('/machining-checklist/home/goto', [MachiningChecklistController::class, 'goTo']);

//Admin
Route::post('/machining-checklist/admin/models', [AdminController::class, 'create']);
Route::post('/machining-checklist/admin/user', [AdminController::class, 'createUser']);


//dashboard

Route::post('/machining-checklist/home/delete', [DashBoardController::class, 'delete']);
