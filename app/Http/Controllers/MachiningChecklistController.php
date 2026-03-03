<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Data;
use Exception;
use Inertia\Inertia;
use App\Models\Users;
use App\Models\Datalist;
use App\Models\models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
class MachiningChecklistController extends Controller
{
    public $finalModel;

    public function store(Request $request)
    {
        //array for value exist checking
        $preparedItems = [];
        $ip = $request->ip();
        $toBecheked = [
            'measure' => ['lot_number'=>'required|string','process'=>'required|string'],
        ];

        $classBank =[
            'measure' => Datalist::class
        ];
        //check if valid page
        $page = $request->input('page')??null;
        if(!$page) return redirect()->back()->with('error', 'Page does not exist!');

        //check & validate required data
        $toValidate = $toBecheked[$page] ?? null;

        if(!$toValidate) return redirect()->back()->with('error', 'Invalid page!');

        $isExist = Validator::make($request->all(),$toValidate);
        if($isExist->fails())  return redirect()->back()->with('error', 'Please complete data!');

        $isTableExist =  $classBank[$page] ?? null;
        if(!$isTableExist) return redirect()->back()->with('error', 'Table not exist!');

        // Saving data
        if( $page === 'measure'){
            $lotNumber = $request->input('lot_number');
            $shift = $request->input('shift');
            $process = $request->input('process');
            $preparedItems[$process]=$request->all();
            $preparing = json_encode($preparedItems);

            $isLotExist = $isTableExist::where('lot_number',$lotNumber)->first();

            if($isLotExist) return redirect()->back()->with('check',"".$lotNumber." already exist!");

            try{

                $isSaved = $isTableExist::create([
                    'lot_number' => $lotNumber,
                    'shift' => $shift,
                    'preparing' =>$preparing,
                    'ip_address' =>$ip
                ]);
                if($isSaved) return redirect()->back()->with('success', 'Saved Successfully!');
            }catch(Exception $e){
                 return redirect()->back()->with('error', `Failed:`.$e->getMessage());
            }
        }
        return redirect()->back()->with('error', 'No Saving function yet!');
    }

    public function loadModels()
    {
        $models = models::all('*');
        $modified =[];
        foreach(   $models as  $key => $values){

            $data = $values->toArray();

            $modified[$data["model"]] =    $data;


        }
        $this->finalModel = json_encode($modified);
    }

    public function inprocess(Request $request)
    {
        $this->loadModels();

        $lot =  $request->input('lot');
        $model = strtoupper($request->input('model'));
        $total_lot =  $request->input('total_lot');
        $isLotExist = Data::where('lot' ,$lot)->first();

        if( $lot && !$total_lot ){
            //detect changes in lot only
            $theme =  !$isLotExist ? 'success-container':'error-container';
            $isExist = !$isLotExist ? ' not  exist save data':' exist update data';
            $message = $model . ' Lot No.: '. $lot  .$isExist;
            return Inertia::render('Home', [
                'flash' => [  $theme => $message],
                'LotData' => $isLotExist ? true:false,
                'detailsLot' =>$isLotExist,
                 'modelsList' => $this->finalModel
            ]);
        }

        $validated = $request->validate([
            'model' => 'required|string',
            'lot'   => 'required|string',
            'date'  => 'required|date',
        ]);


        try{

            Data::create([
                ...$request->except(['pt_data', 'barrelling', 'timer']),
                'pt_data'    => $request->pt_data,
                'barrelling'=> $request->barrelling,
                'timer'     => $request->timer,
            ]);

            return Inertia::render('Home', [
                'flash' => ['success-container' => $request->input('model') . ' Lot No.: '. $lot  . ' saved successfully!'],
                'modelsList' => $this->finalModel
            ]);
        }catch(Exception $e){
            dd($e);
        }

    }

    public function update(Request $request){
         $this->loadModels();
        $validated = $request->validate([
            'model' => 'required|string',
            'lot'   => 'required|string',
            'date'  => 'required|date',
        ]);

        $lot = $request->input('lot');
        $model = strtoupper($request->input('model'));
        if(!$validated){
            return Inertia::render('Home', [
                'flash' => [  'error-container' => 'Update fail please Complete all details for the update'],
                'modelsList' => $this->finalModel
            ]);
        }
        try{
           $updated = Data::where('lot', $lot)->update([
                ...$request->except(['pt_data', 'barrelling', 'timer']),
                'barrelling' => json_encode($request->barrelling, JSON_UNESCAPED_UNICODE),
                'pt_data'    => json_encode($request->pt_data, JSON_UNESCAPED_UNICODE),
                'timer'      => json_encode($request->timer, JSON_UNESCAPED_UNICODE),
            ]);

            $newUpdatedLot = [];
            $isLotExist = Data::where('lot' ,$lot)->first();


            $theme =  $updated ? 'success-container':'error-container';
            $isExist = $updated ? ' updated successfully!':' update failed!';
            $message = $model . ' Lot No.: '. $lot  .$isExist;

            return Inertia::render('Home', [
                'flash' => [  $theme => $message],
                'LotData' => $isLotExist ? true:false,
                'detailsLot' =>$isLotExist->getAttributes(),
                'modelsList' => $this->finalModel
            ]);


        }catch(Exception $e){
             return Inertia::render('Home', [
                'flash' => ['error-container' =>'Cannot update please contact automation!'],
                'modelsList' => $this->finalModel
            ]);
        }
    }

    public function saveManage(Request $request){
         $this->loadModels();
        //User
        $process = $request->input('process') ?? null;
        $area = $request->input('area')?? null;
        $ip_address = $request->input('ip_address')?? null;
        $name = $request->input('name')?? null;
        $surname = $request->input('surname')?? null;
        $permission = $request->input('permission')?? null;
        $id_number = $request->input('id_number')?? null;


        //Model
        $chamfer_barelling_max = $request->input('chamfer_barelling_max')?? null;
        $chamfer_barelling_min = $request->input('chamfer_barelling_min')?? null;
        $chamfer_barelling_target = $request->input('chamfer_barelling_target')?? null;
        $chamfer_type = $request->input('chamfer_type')?? null;
        $barelling_max = $request->input('barelling_max')?? null;
        $barelling_min = $request->input('barelling_min')?? null;
        $barelling_target = $request->input('barelling_target')?? null;
        $cghl_max = $request->input('cghl_max')?? null;
        $cghl_min = $request->input('cghl_min')?? null;
        $cghl_target = $request->input('cghl_target')?? null;
        $flatness_lapping = $request->input('flatness_lapping')?? null;
        $height_lapping = $request->input('height_lapping')?? null;
        $lappingt_max = $request->input('lappingt_max')?? null;
        $lappingt_min = $request->input('lappingt_min')?? null;
        $lappingt_target = $request->input('lappingt_target')?? null;
        $parallelism_lapping = $request->input('parallelism_lapping')?? null;
        $slicing_max = $request->input('slicing_max')?? null;
        $slicing_min = $request->input('slicing_min')?? null;
        $slicing_target = $request->input('slicing_target')?? null;
        $model = strtoupper($request->input('model'))?? null;

        $modelData = [
            "chamfer_barelling_max" =>$chamfer_barelling_max,
            "chamfer_barelling_min" =>$chamfer_barelling_min,
            "chamfer_barelling_target" =>$chamfer_barelling_target,
            "chamfer_type"=>  $chamfer_type ,
            "barelling_max" =>$barelling_max,
            "barelling_min" =>$barelling_min,
            "barelling_target" =>$barelling_target,
            "cghl_max" =>$cghl_max,
            "cghl_min" =>$cghl_min,
            "cghl_target" =>$cghl_target,
            "flatness_lapping" =>$flatness_lapping,
            "height_lapping" =>$height_lapping,
            "lappingt_max" =>$lappingt_max,
            "lappingt_min" =>$lappingt_min,
            "lappingt_target" =>$lappingt_target,
            "parallelism_lapping" =>$parallelism_lapping,
            "slicing_max" =>$slicing_max,
            "slicing_min" =>$slicing_min,
            "slicing_target" =>$slicing_target,
            "model" =>$model,
        ];

        $userData = [
            "area"=>$area,
            "ip_address"=>$ip_address,
            "name"=>$name,
            "surname"=>$surname,
            "permission" =>$permission,
            "id_number"=> floatval($id_number),
        ];

        $validateUser = [
            "area"=>'required',
            "ip_address"=>'required',
            "name"=>'required',
            "surname"=>'required',
            "id_number"=> 'required',
        ];

        $validateModel = [
            'model' =>'required',
             "barelling_max" =>'required',
            "barelling_min" =>'required',
            "barelling_target" =>'required',
            "chamfer_barelling_max" =>'required',
            "chamfer_barelling_min" =>'required',
            "chamfer_barelling_target" =>'required',
            "chamfer_type"=>'required',
            "cghl_max" =>'required',
            "cghl_min" =>'required',
            "cghl_target" =>'required',
            "flatness_lapping" =>'required',
            "height_lapping" =>'required',
            "lappingt_max" =>'required',
            "lappingt_min" =>'required',
            "lappingt_target" =>'required',
            "parallelism_lapping" =>'required',
            "slicing_max" =>'required',
            "slicing_min" =>'required',
            "slicing_target" =>'required',


        ];

        $validateBeforeUpdate =  $process === 'User' ? $validateUser: $validateModel;

        $CompleteData =  $request->validate($validateBeforeUpdate);

        if(!$CompleteData){
            return Inertia::render('Home', ['flash' => ['error-container' =>"Incomplete Data!"],'modelsList' => $this->finalModel]);
        };

        try{

            $isSaved = false;
            if($process === 'Model'){
                $isExist = models::where('model',$model)->first();

                if(!$isExist){
                    $isSaved=models::create($modelData);
                }


            }else if($process === 'User'){
                $isExist = Users::where('id_number',$id_number)->first();
                if(!$isExist){
                    $isSaved = Users::create($userData);
                }

            }
            if( $isSaved){
                $data = $process === 'Model'?$model:$id_number;
                return Inertia::render('Home', [
                    'flash' => ['success-container' =>" ".$process." ".$data." Successfully saved!"],
                    'modelsList' => $this->finalModel
                ]);
            }
            // if duplicate
            return Inertia::render('Home', [
                'flash' => ['error-container' =>" ".$process." already exist!"],
                 'dataExist' => [$process => $isExist],
                 'modelsList' => $this->finalModel
            ]);


        }catch(Exception $e){
            dd($e->getMessage());
        }
    }

    public function allDataDisplay(){
         $this->loadModels();
        $allUser = Users::paginate(10,['*'],'user_page');
        return Inertia::render('Home', [
                'allUser' => $allUser,
                'modelsList' => $this->finalModel
            ]);
    }

    public function updateManager(Request $request){
         $this->loadModels();


        $isProcessString = $request->validate([
            "process" => 'string|required'
        ]);

        if(!$isProcessString ) return Inertia::render('Home', ['flash' => ['error-container' =>"Invalid process type"],'modelsList' => $this->finalModel]);

         //User
        $process = $request->input('process') ?? null;
        $area = $request->input('area')?? null;
        $ip_address = $request->input('ip_address')?? null;
        $name = $request->input('name')?? null;
        $surname = $request->input('surname')?? null;
        $permission = $request->input('permission')?? null;
        $id_number = $request->input('id_number')?? null;


        //Model
        $chamfer_barelling_max = $request->input('chamfer_barelling_max')?? null;
        $chamfer_barelling_min = $request->input('chamfer_barelling_min')?? null;
        $chamfer_barelling_target = $request->input('chamfer_barelling_target')?? null;
        $chamfer_type = $request->input('chamfer_type')?? null;
        $barelling_max = $request->input('barelling_max')?? null;
        $barelling_min = $request->input('barelling_min')?? null;
        $barelling_target = $request->input('barelling_target')?? null;
        $cghl_max = $request->input('cghl_max')?? null;
        $cghl_min = $request->input('cghl_min')?? null;
        $cghl_target = $request->input('cghl_target')?? null;
        $flatness_lapping = $request->input('flatness_lapping')?? null;
        $height_lapping = $request->input('height_lapping')?? null;
        $lappingt_max = $request->input('lappingt_max')?? null;
        $lappingt_min = $request->input('lappingt_min')?? null;
        $lappingt_target = $request->input('lappingt_target')?? null;
        $parallelism_lapping = $request->input('parallelism_lapping')?? null;
        $slicing_max = $request->input('slicing_max')?? null;
        $slicing_min = $request->input('slicing_min')?? null;
        $slicing_target = $request->input('slicing_target')?? null;
        $model = strtoupper($request->input('model'))?? null;

        $modelData = [
            "barelling_max" =>$barelling_max,
            "barelling_min" =>$barelling_min,
            "barelling_target" =>$barelling_target,
            "chamfer_barelling_max" =>$chamfer_barelling_max,
            "chamfer_barelling_min" =>$chamfer_barelling_min,
            "chamfer_barelling_target" =>$chamfer_barelling_target,
            "chamfer_type" => $chamfer_type,
            "cghl_max" =>$cghl_max,
            "cghl_min" =>$cghl_min,
            "cghl_target" =>$cghl_target,
            "flatness_lapping" =>$flatness_lapping,
            "height_lapping" =>$height_lapping,
            "lappingt_max" =>$lappingt_max,
            "lappingt_min" =>$lappingt_min,
            "lappingt_target" =>$lappingt_target,
            "parallelism_lapping" =>$parallelism_lapping,
            "slicing_max" =>$slicing_max,
            "slicing_min" =>$slicing_min,
            "slicing_target" =>$slicing_target,
            "model" =>$model,
        ];

        $userData = [
            "area"=>$area,
            "ip_address"=>$ip_address,
            "name"=>$name,
            "surname"=>$surname,
            "permission" =>$permission,
            "id_number"=> floatval($id_number),
        ];

        $process = $request->input('process');
        $id_number = $request->input('id_number')??null;
        $model =strtoupper($request->input('model')) ??null;

        $checkIfexist =  $process === 'User'? Users::where('id_number', $id_number )->update( $userData):models::where('model',$model)->update( $modelData);
    }

    public function checkExist(Request $request){

         $this->loadModels();
        $isProcessExist = $request->validate(['process' =>"string|required"]);

        if(!$isProcessExist && $isProcessExist === '') return Inertia::render('Home',["flash"=>"Invalid process type",'modelsList' => $this->finalModel]);

        $process = $request->input('process') ?? null;

        if($process === 'User'){
            $idNumber= $request->input('id_number');
            $isExist = Users::where('id_number',$idNumber)->first();

            if ($isExist)  return Inertia::render('Home',
                                                [
                                                        'flash' => ['success-container' => 'Already exist , Please Update Data'],
                                                        'dataExist' =>[$process => $isExist],
                                                        'availabilty' => $process,
                                                        'modelsList' => $this->finalModel
                                                ]);

        }else if($process === 'Model'){

            $idNumber= $request->input('model');

            $isExist = models::where('model',$idNumber)->first();
            if ($isExist)  return Inertia::render('Home',
                                                [
                                                        'flash' => ['success-container' => 'Already exist , Please Update Data'],
                                                        'dataExist' =>[$process => $isExist],
                                                        'availabilty' => $process,
                                                        'modelsList' => $this->finalModel,

                                                ]);
        }

        return Inertia::render('Home', [
                                            'flash' => ['success-container' => 'Not exist , Please Create '.$process.' Data'],
                                            'availabilty' => $idNumber,
                                            'modelsList' => $this->finalModel
                                        ]);

    }


    public function destroy(Request $request){
         $this->loadModels();

        $isValid = $request->validate([
            "process" => "string|required",
            "id" => "int|required"
        ]);

        if(!$isValid) return Inertia::render('Home',[
            "flash" =>["error-container" => "Invalid data type!"],
             'availabilty' => null,
             'modelsList' => $this->finalModel
        ]);

        $process = $request->input('process');
        $id = $request->input('id');
        if($process === 'User'){
            $delete = Users::find($id);

            if(!$delete){
                return  Inertia::render('Home',[
                    "flash" =>["error-container" => "Data Not Found!"],
                    'availabilty' => null,
                    'modelsList' => $this->finalModel
                ]);
            }

            $delete ->delete();

            if($delete) return Inertia::render('Home',[
                "flash" =>["error-container" => "Data Already deleted permanently!"],
                'availabilty' => null,
                'modelsList' => $this->finalModel
            ]);

        }else if($process === 'Model'){
            $delete = models::find($id);

            if(!$delete){
                return  Inertia::render('Home',[
                    "flash" =>["error-container" => "Data Not Found!"],
                    'availabilty' => null,
                    'modelsList' => $this->finalModel
                ]);
            }

            $delete ->delete();

            if($delete) return Inertia::render('Home',[
                "flash" =>["error-container" => "Data Already deleted permanently!"],
                'availabilty' => null,
                'modelsList' => $this->finalModel
            ]);
        }


    }
}


