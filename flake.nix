{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
    haumea = {
      url = "github:nix-community/haumea/v0.2.2";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs =
    {
      self,
      nixpkgs,
      devshell,
      flake-utils,
      haumea,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [
            devshell.overlays.default
          ];
        };

        src = haumea.lib.load {
          src = ./.nix;
          inputs = { inherit pkgs; };
        };

        bun = pkgs.bun;
        claude-code = pkgs.claude-code;
      in
      {
        devShells = rec {
          default = site;
          site = pkgs.devshell.mkShell {
            name = "site";
            packages = [
              bun
              claude-code
            ];
            devshell.startup.link.text = ''
              mkdir -p "$PRJ_DATA_DIR/current"
              ln -sfn ${bun} "$PRJ_DATA_DIR/current/bun"
            '';
            devshell.startup.version_info.text = ''
              echo "---Print flow development environment---"
              echo "bun: $(${bun}/bin/bun --version)"
              echo "claude: $(${claude-code}/bin/claude --version)"
              echo "----------------------------------------"
            '';
          };
        };
      }
    );
}
