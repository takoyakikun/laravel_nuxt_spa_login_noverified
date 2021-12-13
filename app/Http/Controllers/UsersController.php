<?php

namespace App\Http\Controllers;

// 追加フォームバリデーション
use App\Http\Requests\User\StoreRequest;

// 更新フォームバリデーション
use App\Http\Requests\User\UpdateRequest;

// ユーザーモデル
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    use SendsPasswordResetEmails;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::get();

        return response($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\User\StoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRequest $request)
    {
        if ((int)Auth::user()->role_level['auth'] <= (int)resolve(User::class)->roleLevel($request->input('role'), 'auth')) {
            // 入力者より権限が同じか下の場合は入力値を設定
            $role = $request->input('role');
        } else {
            // それ以外は最低レベル(一般)の権限を設定
            $role = 3;
        }

        // パスワードリセットメールをパスワード設定メールに切り替えるフラグ
        \Config::set('temporary.passwordSet', true);

        \DB::beginTransaction();
        try {
            $user = resolve(User::class)->create([
                'name' => $request->input('name'),
                'login_id' => $request->input('login_id'),
                'password' => Hash::make(\Str::random(32)),
                'role' => $role,
            ]);
            $this->broker()->sendResetLink(
                $request->only('login_id')
            );

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
     * @param  \App\Http\Requests\User\UpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateRequest $request, $id)
    {
        $user = resolve(User::class)->find($id);

        if ((int)$user->modify_flg !== 1){
            return response([], 403);
        }

        $updateData = [
            'name' => $request->input('name'),
            'login_id' => $request->input('login_id'),
        ];
        if ((int)Auth::user()->role_level['auth'] <= (int)resolve(User::class)->roleLevel($request->input('role'), 'auth')) {
            // 入力者より権限が同じか下の場合は入力値を設定
            $updateData['role'] = $request->input('role');
        }

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
     * Remove the specified resource from storage.
     *
     * @param  int|string  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // json形式の入力データを配列に変換
        if (!is_numeric($id)) {
            $id = json_decode($id);
        }

        // 入力データが配列ではない場合は配列にして find する
        if (is_array($id)) {
            $finds = $id;
        } else {
            $finds = [$id];
        }
        $users = resolve(User::class)->find($finds);

        // 一つでも削除不可があった場合は403エラー
        foreach ($users as $user) {
            if ((int)$user->delete_flg !== 1){
                return response([], 403);
            }
        }
    
        \DB::beginTransaction();
        try {
            resolve(User::class)->destroy($id);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
        return response([]);
    }

    /**
     * パスワード設定メールを再送信する
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function passwordSetResend($id)
    {
        $user = resolve(User::class)->find($id);

        if ((int)$user->password_set_flg !== 0) {
            return response([], 403);
        }

        // パスワードリセットメールをパスワード設定メールに切り替えるフラグ
        \Config::set('temporary.passwordSet', true);

        try {
            $this->broker()->sendResetLink(
                ['login_id' => $user->login_id]
            );
        } catch (\Exception $e) {
            throw $e;
        }
        return response([]);
    }

    /**
     * 権限の選択オプションを取得
     *
     * @return \Illuminate\Http\Response
     */
    public function roleOptions()
    {
        $roleOptions = [];
        foreach(config('role.role') as $key => $item) {
            // nameが設定されている権限のみ取得
            if (isset($item['name'])) {
                $roleOptions['all'][] = ['value' => $key, 'text' => $item['name']];

                // フォームの選択オプションはログインしているユーザーと同じか下の権限レベルのユーザー権限を取得
                if (resolve(User::class)->roleLevel($key, 'auth') >= (int)Auth::user()->role_level['auth']) {
                    $roleOptions['form'][] = ['value' => $key, 'text' => $item['name']];
                }
            }
        }

        return response($roleOptions);

    }

    /**
     * ユーザーのログインIDがユニークかの判定を取得
     *
     * @return \Illuminate\Http\Response
     */
    public function unique(Request $request)
    {
        try {
            $request->validate([
                'login_id' => 'unique:users',
            ]);
        } catch (\Exception $e) {
            // バリデーションエラーの場合は false を返す
            return response([false]);
        }

        return response([true]);

    }

}
