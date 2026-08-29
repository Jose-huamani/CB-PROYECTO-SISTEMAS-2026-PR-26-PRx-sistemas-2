export class SocialNetworkEntity {
    constructor(
        public readonly id: number | null,
        public readonly name: string,
        public readonly baseUrl: string,
        public readonly icon: string,
        public readonly status: number,
    ) { }
}
