<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

// 追加フォームバリデーション
use App\Http\Requests\Myuser\StoreRequest;

// 更新フォームバリデーション
use App\Http\Requests\Myuser\UpdateRequest;

// パスワード変更フォームバリデーション
use App\Http\Requests\Myuser\PasswordChangeRequest;

// ユーザーモデル
use App\Models\User;

class MyuserController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Myuser\StoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRequest $request)
    {
        
        \DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->input('name'),
                'login_id' => $request->input('login_id'),
                'password' => Hash::make($request->input('password')),
                'role' => 3,
            ]);
            event(new Registered($user));

            // パスワード設定済にする
            $user->markPasswordAsSet();

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }

        return response($user);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Myuser\UpdateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateRequest $request)
    {
        $updateData = [
            'name' => $request->input('name'),
            'login_id' => $request->input('login_id'),
        ];

        $user = User::find(\Auth::user()->id);

        \DB::beginTransaction();
        try {
            $user->fill($updateData)->save();
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }

        return response($user);
    }

    /**
     * パスワード変更
     *
     * @param \App\Http\Requests\Myuser\PasswordChangeRequest $request
     * @return \Illuminate\Http\Response
     */
    public function passwordChange (PasswordChangeRequest $request)
    {
        // 現在のパスワードが正しいかチェック
        if (!(Hash::check($request->get('current_password'), \Auth::user()->password))) {
            return response(['error_message' => '現在のパスワードが間違っています。'], 422);
        }

        $updateData = [
            'password' => Hash::make($request->input('password')),
        ];

        $user = User::find(\Auth::user()->id);

        \DB::beginTransaction();
        try {
            $user->fill($updateData)->save();
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }

        return response($user);
    }

}
