export class CoreService {
    ServiceStatus: ServiceStatus[];
}

export class ServiceStatus {
    Category: string;
    Status: number;
}

export class XboxService {
    ServiceStatus: XboxServiceStatus[];
}

export class XboxServiceStatus {
    Application: string;
    Status: number;
}