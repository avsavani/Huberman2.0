import { SettingsForm } from "./settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your application settings.
        </p>
      </div>
      <SettingsForm />
    </div>
  )
}