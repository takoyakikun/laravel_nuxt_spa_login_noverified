<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use App\Notifications\CustomResetPassword;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_set_at' => 'datetime',
    ];

    /**
     * json出力に追加するカラム
     *
     * @var array
     */
    protected $appends = ['role_level', 'modify_flg', 'delete_flg', 'password_set_flg'];

    /**
     * 認証メールを紐付ける
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail());
    }

    /**
     * パスワードリセットメールを紐付ける
     *
     * @param string $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    }

    /**
     * 権限レベルのカラム
     *
     * @return array
     */
    public function getRoleLevelAttribute ()
    {
        $roleLevels = [];
        foreach (array_keys(\Config::get('settings.roleLevel')) as $roleTypeKey) {
            $roleLevels[$roleTypeKey] = $this->roleLevel($this->role, $roleTypeKey);
        }

        return $roleLevels;
    }

     /**
     * 編集可能ユーザーのカラム
     *
     * @return int
     */
    public function getModifyFlgAttribute ()
    {
        // ログインしていない場合は変更不可
        if (!Auth::user()) {
            return 0;
        }

        // 入力者より権限が上の場合は変更不可
        if ((int)Auth::user()->role_level['auth'] > (int)$this->role_level['auth']) {
            return 0;
        }

        return 1;
    }

   /**
     * 削除可能ユーザーのカラム
     *
     * @return int
     */
    public function getDeleteFlgAttribute ()
    {
        // ログインしていない場合は削除不可
        if (!Auth::user()) {
            return 0;
        }

        // 自ユーザーの場合は削除不可
        if ((int)$this->id === (int)Auth::id()) {
            return 0;
        }

        // 入力者より権限が上の場合は削除不可
        if ((int)Auth::user()->role_level['auth'] > (int)$this->role_level['auth']) {
            return 0;
        }

        return 1;
    }

   /**
     * パスワード設定済ユーザーのカラム
     *
     * @return int
     */
    public function getPasswordSetFlgAttribute ()
    {
        // nullの場合は設定前
        if ($this->password_set_at === null) {
            return 0;
        }
        return 1;
    }

    /**
     * 権限レベルを返す
     *
     * @param int $role
     * @param string $roleType
     * @return int
     */
    public function roleLevel ($role, $roleType = 'auth')
    {
        $roleTypeLevel = \Config::get('settings.roleLevel.'.$roleType);
        if (\Config::get('settings.role.'.$role.'.'.$roleType)) {
            $roleKey = \Config::get('settings.role.'.$role.'.'.$roleType);
        } else {
            $roleTypeLevelMax = array_keys($roleTypeLevel, max($roleTypeLevel));
            $roleKey = $roleTypeLevelMax[0];
        }
        $roleLevel = $roleTypeLevel[$roleKey];

        return $roleLevel;
    }

    /**
     * パスワード設定済にする
     *
     * @return bool
     */
    public function markPasswordAsSet()
    {
        return $this->forceFill([
            'password_set_at' => $this->freshTimestamp(),
        ])->save();
    }

}
