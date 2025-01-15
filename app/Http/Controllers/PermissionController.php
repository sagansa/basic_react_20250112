<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PermissionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_permissions');

        return Inertia::render('Permission/Index', [
            'permissions' => Permission::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create_permissions');

        return Inertia::render('Permission/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create_permissions');

        $validated = $request->validate([
            'action' => ['required', 'string', Rule::in(['view', 'create', 'edit', 'delete'])],
            'module' => ['required', 'string', Rule::in(['users', 'roles', 'permissions'])],
            'name' => ['required', 'string', 'unique:permissions,name']
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web'
        ]);

        return redirect()
            ->route('permissions.index')
            ->with('message', 'Permission created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        $this->authorize('edit_permissions');

        return Inertia::render('Permission/Edit', [
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        $this->authorize('edit_permissions');

        $validated = $request->validate([
            'action' => ['required', 'string', Rule::in(['view', 'create', 'edit', 'delete'])],
            'module' => ['required', 'string', Rule::in(['users', 'roles', 'permissions'])],
            'name' => ['required', 'string', Rule::unique('permissions')->ignore($permission->id)]
        ]);

        $permission->update([
            'name' => $validated['name']
        ]);

        return redirect()
            ->route('permissions.index')
            ->with('message', 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $this->authorize('delete_permissions');

        $permission->delete();

        return redirect()
            ->route('permissions.index')
            ->with('message', 'Permission deleted successfully');
    }
}
