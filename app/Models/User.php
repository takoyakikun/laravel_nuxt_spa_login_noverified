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
        'name', 'login_id', 'password', 'role'
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
        'login_id_verified_at' => 'datetime',
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
     * Undocumented function
     *
     * @return void
     */
    public function getEmailForPasswordReset() {
        return $this->login_id;
    }

    public function routeNotificationForMail() {
        return $this->login_id;
    }

    /**
     * Determine if the user has verified their email address.
     *
     * @return bool
     */
    public function hasVerifiedEmail()
    {
        return ! is_null($this->login_id_verified_at);
    }

    /**
     * Mark the given user's email as verified.
     *
     * @return bool
     */
    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'login_id_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    /**
     * 権限レベルのカラム
     *
     * @return array
     */
    public function getRoleLevelAttribute ()
    {
        $roleLevels = [];
        foreach (array_keys(\Config::get('role.roleLevel')) as $roleTypeKey) {
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
        // 指定した権限タイプのレベルリスト
        $roleTypeLevelList = config('role.roleLevel.'.$roleType);

        // デフォルトは一番弱い(数字が大きい)レベル
        $roleLevel = max($roleTypeLevelList);

        // 該当する権限レベルがある場合はそのレベルに変更
        if (config('role.role.'.$role.'.level.'.$roleType)) {
            $roleKey = config('role.role.'.$role.'.level.'.$roleType);
            if (isset($roleTypeLevelList[$roleKey]) && is_numeric($roleTypeLevelList[$roleKey])) {
                $roleLevel = $roleTypeLevelList[$roleKey];
            }
        }

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
