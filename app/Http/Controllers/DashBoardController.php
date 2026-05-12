<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barelling;
use App\Models\cghModel;
use App\Models\Datalist;
use Carbon\Carbon;
use Exception;

class DashBoardController extends Controller
{
    public function dataBaseBank(string $page)
    {
        $db = [
            'datalist' =>   Datalist::class,
            'barelling' =>   Barelling::class,
            'cghl' =>   cghModel::class,
        ];

        if (!array_key_exists($page, $db)) return false;

        return $db[$page];
    }

    public function getDetails(string $id)
    {
        try {
            $checkIfExist = Datalist::where('id', $id)->first();
            if ($checkIfExist) return $checkIfExist;
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateData(int $id, array $data, string $database)
    {

        $column = str_contains($database, 'Datalist') ? 'id' : 'datalist_id';

        try {
            $updateData = $database::where($column, $id)->update($data);
            if ($updateData) return true;

            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function removeData(string $id, string $database)
    {

        $column = str_contains($database, 'Datalist') ? 'id' : 'datalist_id';
        try {
            $delete = $database::where($column, $id)->delete();
            if ($delete) return true;
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete(Request $request)
    {

        $page = $request->input('page') ?? null;
        $id = $request->input('id') ?? null;

        $dbUse = $this->dataBaseBank($page);

        if (!$page || !$id || !$dbUse) return redirect()->back()->with('error', 'Incomplete details');

        $checkIfExist = $this->getDetails($id);

        if (!$checkIfExist) return redirect()->back()->with('error', 'Data not found!');

        $currentData = $checkIfExist->toArray();
        $newProcess = [];
        $newData = [];
        if ($page !== 'datalist' && count($currentData) > 0) {

            foreach ($currentData["preparing"] as $key => $value) {
                if ($value === $page) {
                    unset($currentData["preparing"][$key]);
                    array_push($newProcess, $value);
                }
            }
        }
        $datalist = $this->dataBaseBank('datalist');

        $newData["preparing"] = $currentData["preparing"] ? json_encode($newProcess) : $dbUse = $this->dataBaseBank('datalist');


        if ($newData["preparing"]) $updated = $this->updateData(intval($id), $newData, $datalist);
        $deleted = $this->removeData($id, $dbUse);
        if ($deleted) return redirect()->back()->with('sucess', $currentData["lot_number"] . 'successfully deleted');
    }
}

