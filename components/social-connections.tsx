import { Linkedin, Twitter, Link2, CheckCircle2 } from "lucide-react"

const connections = [
  {
    platform: "LinkedIn",
    icon: Linkedin,
    connected: true,
    username: "@johndoe",
  },
  {
    platform: "X (Twitter)",
    icon: Twitter,
    connected: false,
    username: null,
  },
]

export function SocialConnections() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Social Connections</h3>
        <Link2 className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {connections.map((connection) => (
          <div key={connection.platform} className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <connection.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{connection.platform}</h4>
                  {connection.connected ? (
                    <p className="text-xs text-muted-foreground">{connection.username}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>
              {connection.connected ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Disconnect
                  </button>
                </div>
              ) : (
                <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded transition-colors">
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Connect your social accounts to share your achievements and grow your network
        </p>
      </div>
    </div>
  )
}