import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[80vh]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground max-w-sm">
                This feature is not part of the initial MVP. User profile, organization settings, and integration keys will live here.
            </p>
        </div>
    );
}
