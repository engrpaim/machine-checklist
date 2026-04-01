<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Data;
use Exception;
use Inertia\Inertia;
use App\Models\Users;
use App\Models\Datalist;
use App\Models\models;
use App\Models\cghModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\ProcessController;
use App\Models\Barelling;
use GuzzleHttp\Handler\Proxy;
use Illuminate\Support\Facades\Process;

class MachiningChecklistController  extends ProcessController
{
    public $finalModel;

    public function dataBaseBank($process)
    {
        $bank = [
            'barelling' => Barelling::class,
            'models' => models::class,
            'cghl' => cghModel::class
        ];

        return $bank[$process];
    }

    public function otherJSON($process)
    {
        $jsonData = [
            'barelling' => ['timer']
        ];
        return $jsonData[$process];
    }

    public function store(Request $request)
    {
        //array for value exist checking
        $preparedItems = [];
        $ip = $request->ip();

        $toBecheked = [
            'measure' => ['lot_number' => 'required|string', 'process' => 'required|string'],
        ];
        //class bank @return model
        $classBank = [
            'measure' => Datalist::class,
            'barelling' => Barelling::class,
            'cghl' => cghModel::class
        ];
        //check if valid page
        $processingDetails = $request->input('page');

        $page = $processingDetails['processing']['page'] ?? null;
        if (!$page) return redirect()->back()->with('error', 'Page does not exist!');

        //check & validate required data
        $toValidate = $toBecheked[$page] ?? null;

        if (!$toValidate) return redirect()->back()->with('error', 'Invalid page!');

        $isExist = Validator::make($processingDetails['processing'], $toValidate);
        if ($isExist->fails())  return redirect()->back()->with('error', 'Please complete data!');

        $isTableExist =  $classBank[$page] ?? null;
        if (!$isTableExist) return redirect()->back()->with('error', 'Table not exist!');


        // Saving data
        //First Save in datalsit

        $lotNumber = $processingDetails['processing']['lot_number'];
        $shift = $processingDetails['processing']['shift'];
        $process = $processingDetails['processing']['process'];
        $preparedItems[$process] = $processingDetails['processing'];
        $preparing = json_encode($preparedItems);
        $checkIfexist  =  $isTableExist::where('lot_number', $lotNumber)->first();

        $insertProcessDetails = new ProcessController();

        //Get model data
        $modelDb = $this->dataBaseBank('models');
        $currentModel =   $processingDetails["model"];
        $models = $insertProcessDetails->getModel($modelDb, $currentModel);
        if (!$models) return redirect()->back()->with('error', 'Model database not found!');
        $convertModel = $models->toArray();


        if (!$checkIfexist) {
            try {
                $isSaved = $isTableExist::create([
                    'lot_number' => $lotNumber,
                    'shift' => $shift,
                    'preparing' => $preparing,
                    'ip_address' => $ip
                ]);
                $data = $processingDetails['processing'];
                $creatBatch = $insertProcessDetails->Batching($process, $isSaved->id, $isSaved->lot_number, $data);
                if ($isSaved) return redirect()->back()->with(
                    [
                        'success' => 'Saved Successfully[Datalist-NW]!',
                        'current_lot' => $creatBatch,
                        'model' => $convertModel
                    ]
                );
            } catch (Exception $e) {
                return redirect()->back()->with('error', `Failed:` . $e->getMessage());
            }
        }

        if ($checkIfexist && $process) {

            $getAllBatch = $classBank[$process];

            if (!$getAllBatch) return redirect()->back()->with('error', 'Process database not found!');
            $isGetDetails =  $getAllBatch::where('datalist_id', $checkIfexist->id)->get();

            if (!$isGetDetails->toArray()) {
                $data = $processingDetails['processing'];
                $creatBatch = $insertProcessDetails->Batching($process, $checkIfexist->id, $checkIfexist->lot_number, $data);
                if ($creatBatch) return redirect()->back()->with(
                    [
                        'success' => 'Saved Successfully[Datalist-NW]!',
                        'current_lot' => $creatBatch,
                        'model' => $convertModel
                    ]
                );
            }
            $allBatchLot = json_encode($isGetDetails->toArray());
            return redirect()->back()->with([
                'modal' => $lotNumber . ' already exist!',
                'batches' => $allBatchLot,
                'model' => $convertModel
            ]);
        }

        //Second save in process
        return redirect()->back()->with('error', 'No Saving function yet!');
    }

    public function lotBatching(Request $request)
    {

        //return batches
        $pageData =  $request->input('page');
        if (!$pageData) return redirect()->back()->with('error', 'Cannot start batching!');

        $lot_number =  $pageData['processing']["lot_number"];
        //get id and created_at

        if (!$lot_number) return redirect()->back()->with('error', 'Lot number not found!');

        $isGetDetails = Datalist::where('lot_number', $lot_number)->first();
        if (!$isGetDetails) return redirect()->back()->with('error', 'Cannot create batch, 1st batch missing!');

        $reference_id = $isGetDetails->id;
        $reference_lot_number = $isGetDetails->lot_number;
        $process =  $pageData["processing"]["process"];

        $data = $pageData["processing"];

        $processControl  = new ProcessController();

        //Get model data
        $modelDb = $this->dataBaseBank('models');
        $currentModel =   $pageData["model"];
        $models = $processControl->getModel($modelDb, $currentModel);
        if (!$models) return redirect()->back()->with('error', 'Model database not found!');
        $convertModel = $models->toArray();

        $creatBatch =  $processControl->Batching($process,  $reference_id, $reference_lot_number, $data);
        if ($creatBatch) return redirect()->back()->with([
            'success' => 'Successfully created new batch!',
            'current_lot' => $creatBatch,
            'model' => $convertModel
        ]);
        return redirect()->back()->with('error', 'Batch creation failed');
    }

    public function autosave(Request $request)
    {

        $form = $request->input('processForm');
        $process =  $form['data']['process'] ?? null;
        $page =  $form['data']['page'] ?? null;
        if (!$form || !$process && !$page) return redirect()->back()->with('error', 'Data not found!');
        $data = $form['details'];
        if (!$data)  return redirect()->back()->with('error', 'No data found!');


        foreach ($form as $key => $value) {
            if ($key !== 'data' && $key !== 'details') {
                $convertedData = json_encode($value);
                $data[$key] = $convertedData;
            }
        }

        $db = $this->dataBaseBank($process);
        $getSaving = new ProcessController();


        $udpateResult =  $getSaving->updateQuery($db, $data, $data['batch_number'], $data['datalist_id']);

        if (!$udpateResult)  return redirect()->back()->with('error', 'Update failed!');

        $convertedDetails = json_encode($udpateResult);
        if ($convertedDetails) return redirect()->back()->with(['success' => 'Saved Successfully[Datalist]!', 'existing' => $convertedDetails]);

        return redirect()->back()->with('error', 'Auto saving failed!');
    }

    public function finalizeProcess(Request $request)
    {

        $finalizeBank = [
            "preparing" => "prepared",
            "measuring" => "measured",
            "approved" => "approved"
        ];
        $form = $request->input('processForm') ?? null;
        $details = $form['details'];
        $data = $form['data'];
        $magnet = [];
        if (!$details) return redirect()->back()->with('error', 'Details not found! complete all data');


        $datalist_id = $details["datalist_id"] ?? null;
        $datalist_lot_number = $details["datalist_lot_number"] ?? null;
        $batch_number = $details["batch_number"] ?? null;
        $status = $details["status"] ?? 'preparing';
        $process = $data['process'] ?? null;

        $checkPointForm = $form["points"] ?? null;
        if ($checkPointForm) {
            if (($form["points"]["chamfer1"] || $form["points"]["chamfer2"]) && $process === 'barelling') {
                $form["points"]["chamfer1"] ? $magnet["chamfer1"] = $form["points"]["chamfer1"] : null;
                $form["points"]["chamfer2"] ? $magnet["chamfer2"] = $form["points"]["chamfer2"] : null;
            }
        }

        if ($status === 'preparing') unset($form["points"]);
        if (!$datalist_id || !$datalist_lot_number || !$batch_number || !$status || !$process) return redirect()->back()->with('error', 'Finalize:Details not found![missing data!]');

        //merge all data
        foreach ($form as $key => $value) {
            if ($key !== 'data' && $key !== 'details' && $key !== 'model') {
                $details[$key] = $value;
            }
        }
        $details['status'] =  $finalizeBank[$status];
        unset($details['created_at']);
        unset($details['updated_at']);

        $db = $this->dataBaseBank($process);
        $databaseProcess = new ProcessController;

        //measuring points
        if ($process === 'barelling') {
            $details["magnet"] = $magnet;
        }

        //Get model data
        $modelDb = $this->dataBaseBank('models');

        $currentModel =   $form["model"];
        $models = $databaseProcess->getModel($modelDb, $currentModel);
        if (!$models) return redirect()->back()->with('error', 'Model database not found!');
        $convertModel = $models->toArray();

        $result = $databaseProcess->updateQuery($db, $details, $details["batch_number"], $details["datalist_id"]);
        if (!$result) return redirect()->back()->with('error', 'Finalized successfully status updated!');
        $convertData = json_encode($result);
        if ($result) return redirect()->back()->with([
            'success' => 'Finalized successfully status updated!',
            'existing' => $convertData,
            'model' => $convertModel
        ]);
        return redirect()->back()->with('success', 'All details found!');
    }


    public function proceedToNext(Request $request)
    {
        $form = $request->input('processForm');
        $data = $form["data"] ?? null;
        $details = $form["details"] ?? null;

        if (!$form || !$details || !$data) return redirect()->back()->with('error', 'Data Missing![Proceed]');

        $bankStatus = [
            "prepared" => "measuring",
            "measured" => "approved"
        ];
        $dataUpdate = [];
        if (!$details["status"]) return redirect()->back()->with('error', 'Status not find![Proceed]');

        $dataUpdate["status"] =   $bankStatus[$details["status"]];
        $id =  $details["datalist_id"] ?? null;
        $batch_number = $details["batch_number"] ?? null;
        $lot_number = $details["datalist_lot_number"] ?? null;
        $process = $data["process"] ?? null;
        if (!$dataUpdate || !$id || !$batch_number || !$process || !$lot_number) return redirect()->back()->with('error', 'Incomplete data cannot be updated![Proceed]');
        $db = $this->dataBaseBank($process);
        $processQuery = new ProcessController;

        //Get model data
        $modelDb = $this->dataBaseBank('models');

        $currentModel =   $form["model"];
        $models = $processQuery->getModel($modelDb, $currentModel);
        if (!$models) return redirect()->back()->with('error', 'Model database not found!');
        $convertModel = $models->toArray();

        $updateData = $processQuery->updateQuery($db, $dataUpdate, $batch_number, $id);

        if (!$updateData) return redirect()->back()->with('error', "Failed proceeding to " . $bankStatus[$details["status"]] . "! ");



        $convertData = json_encode($updateData);
        if (!$convertData) return redirect()->back()->with('error', " " . $lot_number . " not exist!");
        return redirect()->back()->with([
            'success' => " " . $lot_number . " proceeds to " . $bankStatus[$details["status"]] . " exist!",
            "existing" => $convertData,
            "model" => $convertModel
        ]);
    }

    public function getDetails(Request $request)
    {
        $process = $request->input('process');
        $batch = $request->input('batch');
        $id = $request->input('id');
        $model = $request->input('model');

        if (!$process && !$batch && !$id && !$model) return redirect()->back()->with('error', '[Updating]Failed: Missing Data!');

        $bank = $this->dataBaseBank($process);

        if (!$bank) return redirect()->back()->with('error', '[Updating]Failed: Process database not found!');

        $isGetDetails = $bank::where('datalist_id', $id)->where('batch_number', $batch)->first();

        $processQuery = new ProcessController;

        //Get model data
        $modelDb = $this->dataBaseBank('models');
        $models = $processQuery->getModel($modelDb, $model);
        if (!$models) return redirect()->back()->with('error', 'Model database not found!');
        $convertModel = $models->toArray();
        if ($isGetDetails) {
            $convertedDetails = json_encode($isGetDetails->toArray());
            return redirect()->back()->with([
                'success' => $isGetDetails->datalist_lot_number . ' for update data exist!!',
                'existing' => $convertedDetails,
                'model' => $convertModel
            ]);
        }
        dd($request->all(), $bank, $isGetDetails->toArray());
    }

    public function updateData(Request $request)
    {

        $form = $request->input('processForm') ?? null;
        if (!$form) return redirect()->back()->with('error', "Data not found!");
        $data =  $form["details"];
        $identifyData =   $form["data"];

        if (!$identifyData) return redirect()->back()->with('error', "Process not found!");
        foreach ($form as $key => $value) {
            if ($key !== 'data' && $key !== 'details') {
                $data[$key] = $value;
            }
        }

        $process =  $identifyData['process'] ?? null;
        $batch_number = $data['batch_number'] ?? null;
        $db = $this->dataBaseBank($process);
        $id = $data['datalist_id'] ?? null;

        if (!$process || !$batch_number || !$db || !$id) return redirect()->back()->with('error', '[Updating]Failed: Missing data!');
        $updateData  = new ProcessController;
        $result = $updateData->updateQuery($db, $data, $batch_number, $id);
        if ($result) return redirect()->back()->with('success', '[Updating]Pic updated successfully!');

        return redirect()->back()->with('error', '[Updating]Error 404!');
    }
    ///oldd stufffffffffffffffff
    public function loadModels()
    {
        $models = models::all('*');
        $modified = [];

        foreach ($models as  $key => $values) {
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
        $isLotExist = Data::where('lot', $lot)->first();

        if ($lot && !$total_lot) {
            //detect changes in lot only
            $theme =  !$isLotExist ? 'success-container' : 'error-container';
            $isExist = !$isLotExist ? ' not  exist save data' : ' exist update data';
            $message = $model . ' Lot No.: ' . $lot  . $isExist;
            return Inertia::render('Home', [
                'flash' => [$theme => $message],
                'LotData' => $isLotExist ? true : false,
                'detailsLot' => $isLotExist,
                'modelsList' => $this->finalModel
            ]);
        }

        $validated = $request->validate([
            'model' => 'required|string',
            'lot'   => 'required|string',
            'date'  => 'required|date',
        ]);


        try {

            Data::create([
                ...$request->except(['pt_data', 'barrelling', 'timer']),
                'pt_data'    => $request->pt_data,
                'barrelling' => $request->barrelling,
                'timer'     => $request->timer,
            ]);

            return Inertia::render('Home', [
                'flash' => ['success-container' => $request->input('model') . ' Lot No.: ' . $lot  . ' saved successfully!'],
                'modelsList' => $this->finalModel
            ]);
        } catch (Exception $e) {
            dd($e);
        }
    }

    // public function update(Request $request)
    // {
    //     $this->loadModels();
    //     $validated = $request->validate([
    //         'model' => 'required|string',
    //         'lot'   => 'required|string',
    //         'date'  => 'required|date',
    //     ]);

    //     $lot = $request->input('lot');
    //     $model = strtoupper($request->input('model'));
    //     if (!$validated) {
    //         return Inertia::render('Home', [
    //             'flash' => ['error-container' => 'Update fail please Complete all details for the update'],
    //             'modelsList' => $this->finalModel
    //         ]);
    //     }
    //     try {
    //         $updated = Data::where('lot', $lot)->update([
    //             ...$request->except(['pt_data', 'barrelling', 'timer']),
    //             'barrelling' => json_encode($request->barrelling, JSON_UNESCAPED_UNICODE),
    //             'pt_data'    => json_encode($request->pt_data, JSON_UNESCAPED_UNICODE),
    //             'timer'      => json_encode($request->timer, JSON_UNESCAPED_UNICODE),
    //         ]);

    //         $newUpdatedLot = [];
    //         $isLotExist = Data::where('lot', $lot)->first();


    //         $theme =  $updated ? 'success-container' : 'error-container';
    //         $isExist = $updated ? ' updated successfully!' : ' update failed!';
    //         $message = $model . ' Lot No.: ' . $lot  . $isExist;

    //         return Inertia::render('Home', [
    //             'flash' => [$theme => $message],
    //             'LotData' => $isLotExist ? true : false,
    //             'detailsLot' => $isLotExist->getAttributes(),
    //             'modelsList' => $this->finalModel
    //         ]);
    //     } catch (Exception $e) {
    //         return Inertia::render('Home', [
    //             'flash' => ['error-container' => 'Cannot update please contact automation!'],
    //             'modelsList' => $this->finalModel
    //         ]);
    //     }
    // }

    public function saveManage(Request $request)
    {
        $this->loadModels();
        //User
        $process = $request->input('process') ?? null;
        $area = $request->input('area') ?? null;
        $ip_address = $request->input('ip_address') ?? null;
        $name = $request->input('name') ?? null;
        $surname = $request->input('surname') ?? null;
        $permission = $request->input('permission') ?? null;
        $id_number = $request->input('id_number') ?? null;


        //Model
        $chamfer_barelling_max = $request->input('chamfer_barelling_max') ?? null;
        $chamfer_barelling_min = $request->input('chamfer_barelling_min') ?? null;
        $chamfer_barelling_target = $request->input('chamfer_barelling_target') ?? null;
        $chamfer_type = $request->input('chamfer_type') ?? null;
        $barelling_max = $request->input('barelling_max') ?? null;
        $barelling_min = $request->input('barelling_min') ?? null;
        $barelling_target = $request->input('barelling_target') ?? null;
        $cghl_max = $request->input('cghl_max') ?? null;
        $cghl_min = $request->input('cghl_min') ?? null;
        $cghl_target = $request->input('cghl_target') ?? null;
        $flatness_lapping = $request->input('flatness_lapping') ?? null;
        $height_lapping = $request->input('height_lapping') ?? null;
        $lappingt_max = $request->input('lappingt_max') ?? null;
        $lappingt_min = $request->input('lappingt_min') ?? null;
        $lappingt_target = $request->input('lappingt_target') ?? null;
        $parallelism_lapping = $request->input('parallelism_lapping') ?? null;
        $slicing_max = $request->input('slicing_max') ?? null;
        $slicing_min = $request->input('slicing_min') ?? null;
        $slicing_target = $request->input('slicing_target') ?? null;
        $model = strtoupper($request->input('model')) ?? null;

        $modelData = [
            "chamfer_barelling_max" => $chamfer_barelling_max,
            "chamfer_barelling_min" => $chamfer_barelling_min,
            "chamfer_barelling_target" => $chamfer_barelling_target,
            "chamfer_type" =>  $chamfer_type,
            "barelling_max" => $barelling_max,
            "barelling_min" => $barelling_min,
            "barelling_target" => $barelling_target,
            "cghl_max" => $cghl_max,
            "cghl_min" => $cghl_min,
            "cghl_target" => $cghl_target,
            "flatness_lapping" => $flatness_lapping,
            "height_lapping" => $height_lapping,
            "lappingt_max" => $lappingt_max,
            "lappingt_min" => $lappingt_min,
            "lappingt_target" => $lappingt_target,
            "parallelism_lapping" => $parallelism_lapping,
            "slicing_max" => $slicing_max,
            "slicing_min" => $slicing_min,
            "slicing_target" => $slicing_target,
            "model" => $model,
        ];

        $userData = [
            "area" => $area,
            "ip_address" => $ip_address,
            "name" => $name,
            "surname" => $surname,
            "permission" => $permission,
            "id_number" => floatval($id_number),
        ];

        $validateUser = [
            "area" => 'required',
            "ip_address" => 'required',
            "name" => 'required',
            "surname" => 'required',
            "id_number" => 'required',
        ];

        $validateModel = [
            'model' => 'required',
            "barelling_max" => 'required',
            "barelling_min" => 'required',
            "barelling_target" => 'required',
            "chamfer_barelling_max" => 'required',
            "chamfer_barelling_min" => 'required',
            "chamfer_barelling_target" => 'required',
            "chamfer_type" => 'required',
            "cghl_max" => 'required',
            "cghl_min" => 'required',
            "cghl_target" => 'required',
            "flatness_lapping" => 'required',
            "height_lapping" => 'required',
            "lappingt_max" => 'required',
            "lappingt_min" => 'required',
            "lappingt_target" => 'required',
            "parallelism_lapping" => 'required',
            "slicing_max" => 'required',
            "slicing_min" => 'required',
            "slicing_target" => 'required',


        ];

        $validateBeforeUpdate =  $process === 'User' ? $validateUser : $validateModel;

        $CompleteData =  $request->validate($validateBeforeUpdate);

        if (!$CompleteData) {
            return Inertia::render('Home', ['flash' => ['error-container' => "Incomplete Data!"], 'modelsList' => $this->finalModel]);
        };

        try {

            $isSaved = false;
            if ($process === 'Model') {
                $isExist = models::where('model', $model)->first();

                if (!$isExist) {
                    $isSaved = models::create($modelData);
                }
            } else if ($process === 'User') {
                $isExist = Users::where('id_number', $id_number)->first();
                if (!$isExist) {
                    $isSaved = Users::create($userData);
                }
            }
            if ($isSaved) {
                $data = $process === 'Model' ? $model : $id_number;
                return Inertia::render('Home', [
                    'flash' => ['success-container' => " " . $process . " " . $data . " Successfully saved!"],
                    'modelsList' => $this->finalModel
                ]);
            }
            // if duplicate
            return Inertia::render('Home', [
                'flash' => ['error-container' => " " . $process . " already exist!"],
                'dataExist' => [$process => $isExist],
                'modelsList' => $this->finalModel
            ]);
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }

    public function allDataDisplay()
    {
        $this->loadModels();
        $allUser = Users::paginate(10, ['*'], 'user_page');
        return Inertia::render('Home', [
            'allUser' => $allUser,
            'modelsList' => $this->finalModel
        ]);
    }

    public function updateManager(Request $request)
    {
        $this->loadModels();


        $isProcessString = $request->validate([
            "process" => 'string|required'
        ]);

        if (!$isProcessString) return Inertia::render('Home', ['flash' => ['error-container' => "Invalid process type"], 'modelsList' => $this->finalModel]);

        //User
        $process = $request->input('process') ?? null;
        $area = $request->input('area') ?? null;
        $ip_address = $request->input('ip_address') ?? null;
        $name = $request->input('name') ?? null;
        $surname = $request->input('surname') ?? null;
        $permission = $request->input('permission') ?? null;
        $id_number = $request->input('id_number') ?? null;


        //Model
        $chamfer_barelling_max = $request->input('chamfer_barelling_max') ?? null;
        $chamfer_barelling_min = $request->input('chamfer_barelling_min') ?? null;
        $chamfer_barelling_target = $request->input('chamfer_barelling_target') ?? null;
        $chamfer_type = $request->input('chamfer_type') ?? null;
        $barelling_max = $request->input('barelling_max') ?? null;
        $barelling_min = $request->input('barelling_min') ?? null;
        $barelling_target = $request->input('barelling_target') ?? null;
        $cghl_max = $request->input('cghl_max') ?? null;
        $cghl_min = $request->input('cghl_min') ?? null;
        $cghl_target = $request->input('cghl_target') ?? null;
        $flatness_lapping = $request->input('flatness_lapping') ?? null;
        $height_lapping = $request->input('height_lapping') ?? null;
        $lappingt_max = $request->input('lappingt_max') ?? null;
        $lappingt_min = $request->input('lappingt_min') ?? null;
        $lappingt_target = $request->input('lappingt_target') ?? null;
        $parallelism_lapping = $request->input('parallelism_lapping') ?? null;
        $slicing_max = $request->input('slicing_max') ?? null;
        $slicing_min = $request->input('slicing_min') ?? null;
        $slicing_target = $request->input('slicing_target') ?? null;
        $model = strtoupper($request->input('model')) ?? null;

        $modelData = [
            "barelling_max" => $barelling_max,
            "barelling_min" => $barelling_min,
            "barelling_target" => $barelling_target,
            "chamfer_barelling_max" => $chamfer_barelling_max,
            "chamfer_barelling_min" => $chamfer_barelling_min,
            "chamfer_barelling_target" => $chamfer_barelling_target,
            "chamfer_type" => $chamfer_type,
            "cghl_max" => $cghl_max,
            "cghl_min" => $cghl_min,
            "cghl_target" => $cghl_target,
            "flatness_lapping" => $flatness_lapping,
            "height_lapping" => $height_lapping,
            "lappingt_max" => $lappingt_max,
            "lappingt_min" => $lappingt_min,
            "lappingt_target" => $lappingt_target,
            "parallelism_lapping" => $parallelism_lapping,
            "slicing_max" => $slicing_max,
            "slicing_min" => $slicing_min,
            "slicing_target" => $slicing_target,
            "model" => $model,
        ];

        $userData = [
            "area" => $area,
            "ip_address" => $ip_address,
            "name" => $name,
            "surname" => $surname,
            "permission" => $permission,
            "id_number" => floatval($id_number),
        ];

        $process = $request->input('process');
        $id_number = $request->input('id_number') ?? null;
        $model = strtoupper($request->input('model')) ?? null;

        $checkIfexist =  $process === 'User' ? Users::where('id_number', $id_number)->update($userData) : models::where('model', $model)->update($modelData);
    }

    public function checkExist(Request $request)
    {

        $this->loadModels();
        $isProcessExist = $request->validate(['process' => "string|required"]);

        if (!$isProcessExist && $isProcessExist === '') return Inertia::render('Home', ["flash" => "Invalid process type", 'modelsList' => $this->finalModel]);

        $process = $request->input('process') ?? null;

        if ($process === 'User') {
            $idNumber = $request->input('id_number');
            $isExist = Users::where('id_number', $idNumber)->first();

            if ($isExist)  return Inertia::render(
                'Home',
                [
                    'flash' => ['success-container' => 'Already exist , Please Update Data'],
                    'dataExist' => [$process => $isExist],
                    'availabilty' => $process,
                    'modelsList' => $this->finalModel
                ]
            );
        } else if ($process === 'Model') {

            $idNumber = $request->input('model');

            $isExist = models::where('model', $idNumber)->first();
            if ($isExist)  return Inertia::render(
                'Home',
                [
                    'flash' => ['success-container' => 'Already exist , Please Update Data'],
                    'dataExist' => [$process => $isExist],
                    'availabilty' => $process,
                    'modelsList' => $this->finalModel,

                ]
            );
        }

        return Inertia::render('Home', [
            'flash' => ['success-container' => 'Not exist , Please Create ' . $process . ' Data'],
            'availabilty' => $idNumber,
            'modelsList' => $this->finalModel
        ]);
    }


    public function destroy(Request $request)
    {
        $this->loadModels();

        $isValid = $request->validate([
            "process" => "string|required",
            "id" => "int|required"
        ]);

        if (!$isValid) return Inertia::render('Home', [
            "flash" => ["error-container" => "Invalid data type!"],
            'availabilty' => null,
            'modelsList' => $this->finalModel
        ]);

        $process = $request->input('process');
        $id = $request->input('id');
        if ($process === 'User') {
            $delete = Users::find($id);

            if (!$delete) {
                return  Inertia::render('Home', [
                    "flash" => ["error-container" => "Data Not Found!"],
                    'availabilty' => null,
                    'modelsList' => $this->finalModel
                ]);
            }

            $delete->delete();

            if ($delete) return Inertia::render('Home', [
                "flash" => ["error-container" => "Data Already deleted permanently!"],
                'availabilty' => null,
                'modelsList' => $this->finalModel
            ]);
        } else if ($process === 'Model') {
            $delete = models::find($id);

            if (!$delete) {
                return  Inertia::render('Home', [
                    "flash" => ["error-container" => "Data Not Found!"],
                    'availabilty' => null,
                    'modelsList' => $this->finalModel
                ]);
            }

            $delete->delete();

            if ($delete) return Inertia::render('Home', [
                "flash" => ["error-container" => "Data Already deleted permanently!"],
                'availabilty' => null,
                'modelsList' => $this->finalModel
            ]);
        }
    }
}
