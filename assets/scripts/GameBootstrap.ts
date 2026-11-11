import { _decorator, Component, director } from 'cc';

const { ccclass } = _decorator;

/** Loads the runtime game module before mounting its component into the scene. */
@ccclass('HappyChickGameBootstrap')
export class GameBootstrap extends Component {
    onLoad (): void {
        Promise.all([
            import('cc'),
            import('./FarmGame'),
        ]).then(([cc, gameModule]) => {
            const { Camera, director, Node } = cc;
            const Game = gameModule.FarmGame;
            const scene = director.getScene();
            let host = scene?.getChildByName('Farm Game') ?? null;
            if (!host && scene) {
                host = new Node('Farm Game');
                scene.addChild(host);
            }
            if (!host) return;
            if (!host.getChildByName('Main Camera')) {
                const cameraNode = new Node('Main Camera');
                host.addChild(cameraNode);
                cameraNode.addComponent(Camera);
            }
            Game.mount(host);
        }).catch((error: unknown) => {
            console.error('[Happy Chick] Failed to load game:', error);
        });
    }
}
