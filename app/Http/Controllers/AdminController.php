<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\ModelDetails;
use App\Models\UserArea;

use Exception;

class AdminController extends Controller
{
    public function bankDataBase(string $db)
    {
        $bank = [
            'model' => ['db' => ModelDetails::class, 'reload' => 'modelsList'],
            'user' =>  ['db' => UserArea::class, 'reload' => 'userList'],
        ];

        return  $bank[$db];
    }
    public function getDetails(string $id, string $page)
    {
        $db = $this->bankDataBase($page);
        try {
            $details = $db['db']::where('id', $id)->first();
            return $details;
        } catch (Exception $e) {

            return $e->getMessage();
        }
    }

    public function save(array $data, string $page)
    {
        //create new data
        $db = $this->bankDataBase($page);
        try {
            $db['db']::create($data);
            return true;
        } catch (Exception $e) {
            $duplicated = $e->getMessage();
            return redirect()->back()->with('error',  str_contains($duplicated, 'Duplicate entry!') ? 'Duplicate Entry Error!' : 'Updated Unsuccessfull!');
        }
    }

    public function reloadUpdate(string $page)
    {
        //return udpate data
        $db = $this->bankDataBase($page);
        return $db['db']::orderBy('id', 'desc')->paginate(10);
    }

    public function updateAdmin(array $data, int $id, string $page)
    {
        //udpate new data
        $db = $this->bankDataBase($page);

        try {
            $details = $db['db']::where('id', $id)->update($data);
            if ($details) return true;
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function createFile(array $file, string $model)
    {
        $filepaths = [];
        $count = 0;
        $checkFiles = Storage::disk('public')->files("model/{$model}");
        foreach ($file as $key => $value) {
            $count += 1;
            if ($value) {
                //delete filest to udpate
                foreach ($checkFiles as $deleteFile) {
                    if (str_contains($deleteFile, $key)) {
                        $delete = Storage::disk('public')->delete($deleteFile);
                    }
                }

                $filename = $key . "." . $value->getClientOriginalExtension();
                $path = $value->storeAs("model/{$model}", $filename, 'public');
                $filepaths['point' . $count] = $path;
            }
        }

        return $filepaths;
    }

    public function delete(string $id, string $page)
    {
        $db = $this->bankDataBase($page);
        try {
            $delete = $db['db']::where('id', $id)->delete();
            if ($delete) return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function create(Request $request)
    {

        $model = $request->input('model') ?? null;
        $allData = $request->all();
        $page = $allData["page"];
        $crud = $allData["crud"];

        unset($allData["page"]);
        unset($allData["crud"]);

        $isExist =  $allData["id"] ? $this->getDetails($allData["id"], $page) : null;

        $db = $this->bankDataBase($page);
        if ($page === 'model') {
            $point1 = $request->file('chamfer_point1_data') ?? null;
            $point2 = $request->file('chamfer_point2_data') ?? null;

            //update photo
            $files = ['point1' => $point1, 'point2' => $point2];
            $createdFiles = $this->createFile($files, $model);

            if ($files['point1']) unset($allData["chamfer_point1_data"]);
            if ($files['point2']) unset($allData["chamfer_point2_data"]);

            $files['point1'] && array_key_exists('point1', $createdFiles)  ? $allData["chamfer_point1_data"] = $createdFiles['point1'] : null;
            $files['point2'] && array_key_exists('point2', $createdFiles)  ? $allData["chamfer_point2_data"] = $createdFiles['point2'] : null;
        }

        switch ($crud) {
            case 'save':
                //save data
                if (($isExist || $allData["id"] > 0)) {
                    $id =  $isExist->id ??  $allData["id"];
                    $updateData = $this->updateAdmin($allData, $id, $page);

                    if ($updateData) return redirect()->back()->with([
                        'success' => 'Updated Successfully',
                    ]);

                    return redirect()->back()->with('error', "$isExist->model already exist!");
                };

                $dataSaved = $this->save($allData, $page);

                if ($dataSaved) return redirect()->back()->with([
                    'currentUpdate' =>  $dataSaved,
                    'success' => "Successfully " . $allData['model'] . " added!"
                ]);
                return redirect()->back()->with('error', 'Error saving!,');
                break;

            case 'delete':
                //Delete data
                $id =  $isExist->id  ?? null;
                $model =  $isExist->model  ?? null;
                if ($id) {
                    $delete = $this->delete($id, $page);
                    if ($delete) return redirect()->back()->with([
                        'success' => "Deleted Successfully",
                    ]);
                }
                return redirect()->back()->with('error', 'Error Deleting!,');
                break;

            default:
                return redirect()->back()->with('error', 'Operation not allowed!');
                break;
        }
    }

    public function createUser(Request $request)
    {

        $first = $request->input('first_name');
        $last = $request->input('last_name');
        $idNumber = $request->input('id_number');
        $machine =  $request->input('machine_type');
        $area =  $request->input('area');
        $permission =  $request->input('permission');
        $page = $request->input('page');
        $crud =  $request->input('crud');
        $id =  $request->input('id') ?? null;
      
        $ip_1 =  $request->input('ip_1') !== null ? intval($request->input('ip_1')):null;
        $ip_2 =  $request->input('ip_2') !== null ? intval($request->input('ip_2')):null;
        $ip_3 =  $request->input('ip_3') !== null? intval($request->input('ip_3')):null;
        $ip_4 =  $request->input('ip_4') !== null? intval($request->input('ip_4')):null;

   
        if (  $ip_1 === null  || $ip_2 === null || $ip_3 === null || $ip_4 === null) return redirect()->back()->with('error', 'I.P Address not completed!');
        $ipAddress =  $ip_1 . "." . $ip_2  . "." .$ip_3. "." . $ip_4;

        $userName = $first && $idNumber ? strtoupper(preg_replace('/[^A-Za-z0-9]/', '_', $first)) . "(" . $idNumber . ")" : null;
        
        $data = [
            'ip_address' => $ipAddress,
            'first_name' => $first ?? null,
            'last_name' => $last ?? null,
            'id_number' => $idNumber ?? null,
            'machine_type' => $machine ?? null,
            'area' => $area ?? null,
            'permission' => $permission ?? null,
            'user_name' =>  $userName
        ];

        $validator = Validator::make($data, [
            'ip_address'   => 'required|string',
            'first_name'   => 'nullable|string',
            'last_name'    => 'nullable|string',
            'id_number'    => 'nullable|string',
            'machine_type' => 'nullable|string',
            'area'         => 'nullable|string',
            'permission'   => 'nullable|string',
            'user_name'    => 'nullable|string',
        ]);




        if (!$validator) return redirect()->back()->with('error', 'User validation failed!');
           
        switch ($crud) {
            case 'save':
                if ($id) {
                    $update = $this->updateAdmin($data, $id, $page);
                    if ($update) return redirect()->back()->with('success', 'Update successfully!');
                    return redirect()->back()->with('error', 'Update unsuccessful!');
                }
                $createNewUser = $this->save($data, $page);
                if ($createNewUser) return redirect()->back()->with('success',  $ipAddress . ' successfully added!');
                break;

            default:
                break;
        }

        return redirect()->back()->with('error',  'Process not found![User]');
    }
}
