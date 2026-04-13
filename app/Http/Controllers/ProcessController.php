<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Barelling;
use App\Models\cghModel;
use App\Models\models;
use Mockery\Expectation;

class ProcessController extends Controller
{
    public function  checkIfExist($id, $lot_number, $dbUse)
    {
        //return latest data
        try {
            $checkIfExist = $dbUse::where('datalist_id', $id)
                ->where('datalist_lot_number', $lot_number)
                ->orderBy('batch_number', 'desc')
                ->first();
            return $checkIfExist;
        } catch (ModelNotFoundException $E) {
            return false;
        }
    }
    public function  checkBatch1($id, $lot_number, $dbUse)
    {
        //return latest data
        try {
            $checkIfExist = $dbUse::where('datalist_id', $id)
                ->where('datalist_lot_number', $lot_number)
                ->where('batch_number', 1)
                ->first();
            return $checkIfExist;
        } catch (ModelNotFoundException $E) {
            return false;
        }
    }

    public function getModel($db, $model)
    {
        try {
            $checkIfExist = $db::where('model', $model)->first();
            return $checkIfExist;
        } catch (ModelNotFoundException $E) {
            return false;
        }
    }

    public function savingQuery($db, $data)
    {
        // Save data
        try {
            $IsSaved = $db::create($data);
            if ($IsSaved) return $IsSaved;
            return false;
        } catch (ModelNotFoundException $E) {
            return false;
        }
    }
    public function updateQuery($db, $data, $batchNumber, $dataListId)
    {

        // Save data
        unset($data['created_at']);
        unset($data['updated_at']);

        try {
            $IsSaved = $db::where('datalist_id', $dataListId)->where('batch_number', $batchNumber)->update($data);

            if ($IsSaved) {
                $result = $db::where('datalist_id', $dataListId)
                    ->where('batch_number', $batchNumber)
                    ->first();
                return $result->toarray();
            };
            return false;
        } catch (ModelNotFoundException $E) {
            return false;
        }
    }

    public function Batching($process, $id, $lot_number, $data)
    {

        if (!$process) return redirect()->back()->with('error', 'Process not exist!');
        if (!$data) return redirect()->back()->with('error', 'Data not exist!');

        $shift = $data['shift'] ?? null;
        $operatorName = $data['operator_name'] ?? null;
        $checker = $data['checker'] ?? null;
        $staffEngineer = $data['staff_engineer'] ?? null;



        $processBank = [
            'barelling' => Barelling::class,
            'cghl' => cghModel::class,
        ];

        $dataBank = [
            'barelling'  => [
                'preparation' => [
                    "datalist_id" => 'required|string',
                    "datalist_lot_number" => 'required|string',
                    "batch_number" => 'required|string',
                ],
            ]
        ];

        if (!$processBank[$process] && !$dataBank[$process]['preparation']) return redirect()->back()->with('error', 'No preparation process!');

        $dbUse = $processBank[$process];
        $checkIfExist = $this->checkIfExist($id, $lot_number, $dbUse);

        if ($checkIfExist) {

            if (!$checkIfExist->batch_number || $checkIfExist->batch_number < 1) return redirect()->back()->with('error', 'Batch number not exist!');



            $addedBatch  = [
                'datalist_id' => $id,
                'datalist_lot_number' => $lot_number,
                'batch_number' =>  $checkIfExist->batch_number + 1,
                'shift' => $shift,
                'operator_name' => $operatorName,
                'checker' => $checker,
                'staff_engineer' => $staffEngineer
            ];


            return $this->savingQuery($dbUse, $addedBatch);
        } else {
            $initialData = [
                'datalist_id' => $id,
                'datalist_lot_number' => $lot_number,
                'batch_number' =>  1,
                'shift' => $shift,
                'operator_name' => $operatorName,
                'checker' => $checker,
                'staff_engineer' => $staffEngineer
            ];
            return $this->savingQuery($dbUse, $initialData);
        }
    }
}
