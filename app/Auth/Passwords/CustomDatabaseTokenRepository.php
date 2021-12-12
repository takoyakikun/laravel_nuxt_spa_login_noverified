<?php

namespace App\Auth\Passwords;

use Illuminate\Auth\Passwords\DatabaseTokenRepository;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class CustomDatabaseTokenRepository extends DatabaseTokenRepository
{
    /**
     * DBに追加するカラムを変更
     *
     * @param  string  $loginId
     * @param  string  $token
     * @return array
     */
    protected function getPayload($loginId, $token)
    {
        return ['login_id' => $loginId, 'token' => $this->hasher->make($token), 'created_at' => new Carbon];
    }

    /**
     * Determine if a token record exists and is valid.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @param  string  $token
     * @return bool
     */
    public function exists(CanResetPasswordContract $user, $token)
    {
        $record = (array) $this->getTable()->where(
            'login_id', $user->getEmailForPasswordReset()
        )->first();

        return $record &&
               ! $this->tokenExpired($record['created_at']) &&
                 $this->hasher->check($token, $record['token']);
    }

}