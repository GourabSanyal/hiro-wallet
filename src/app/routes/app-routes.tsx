import { Suspense } from 'react';
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BroadcastErrorDrawer } from '@app/components/broadcast-error-drawer/broadcast-error-drawer';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Container } from '@app/features/container/container';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseFeeDrawer } from '@app/features/increase-fee-drawer/increase-fee-drawer';
import { ledgerJwtSigningRoutes } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.routes';
import { ledgerMessageSigningRoutes } from '@app/features/ledger/flows/message-signing/ledger-sign-msg.routes';
import { ledgerRequestKeysRoutes } from '@app/features/ledger/flows/request-keys/ledger-request-keys.routes';
import { ledgerTxSigningRoutes } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.routes';
import { AddNetwork } from '@app/features/message-signer/add-network/add-network';
import { RetrieveTaprootToNativeSegwit } from '@app/features/retrieve-taproot-to-native-segwit/retrieve-taproot-to-native-segwit';
import { ThemesDrawer } from '@app/features/theme-drawer/theme-drawer';
import { AllowDiagnosticsPage } from '@app/pages/allow-diagnostics/allow-diagnostics';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { FundPage } from '@app/pages/fund/fund';
import { Home } from '@app/pages/home/home';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { MagicRecoveryCode } from '@app/pages/onboarding/magic-recovery-code/magic-recovery-code';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { PsbtRequest } from '@app/pages/psbt-request/psbt-request';
import { ReceiveBtcModal } from '@app/pages/receive-tokens/receive-btc';
import { ReceiveModal } from '@app/pages/receive-tokens/receive-modal';
import { ReceiveStxModal } from '@app/pages/receive-tokens/receive-stx';
import { ReceiveCollectibleModal } from '@app/pages/receive/receive-collectible/receive-collectible-modal';
import { ReceiveCollectibleOrdinal } from '@app/pages/receive/receive-collectible/receive-collectible-oridinal';
import { RpcGetAddresses } from '@app/pages/rpc-get-addresses/rpc-get-addresses';
import { rpcSendTransferRoutes } from '@app/pages/rpc-send-transfer/rpc-send-transfer.routes';
import { SelectNetwork } from '@app/pages/select-network/select-network';
import { BroadcastError } from '@app/pages/send/broadcast-error/broadcast-error';
import { SendInscriptionContainer } from '@app/pages/send/ordinal-inscription/components/send-inscription-container';
import { SendInscriptionChooseFee } from '@app/pages/send/ordinal-inscription/send-inscription-choose-fee';
import { SendInscriptionForm } from '@app/pages/send/ordinal-inscription/send-inscription-form';
import { SendInscriptionReview } from '@app/pages/send/ordinal-inscription/send-inscription-review';
import { SendInscriptionSummary } from '@app/pages/send/ordinal-inscription/sent-inscription-summary';
import { sendCryptoAssetFormRoutes } from '@app/pages/send/send-crypto-asset-form/send-crypto-asset-form.routes';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { StacksMessageSigningRequest } from '@app/pages/stacks-message-signing-request/stacks-message-signing-request';
import { TransactionRequest } from '@app/pages/transaction-request/transaction-request';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';
import { Unlock } from '@app/pages/unlock';
import { ProfileUpdateRequest } from '@app/pages/update-profile-request/update-profile-request';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { AccountGate } from '@app/routes/account-gate';
import { useHasUserRespondedToAnalyticsConsent } from '@app/store/settings/settings.selectors';

import { OnboardingGate } from './onboarding-gate';

export function AppRoutes() {
  const routes = useAppRoutes();
  return <RouterProvider router={routes} />;
}

function useAppRoutes() {
  const userHasNotConsentedToDiagnostics = useHasUserRespondedToAnalyticsConsent();

  if (!userHasNotConsentedToDiagnostics)
    return createHashRouter(
      createRoutesFromElements(
        <Route>
          <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsPage />} />
          <Route path="*" element={<Navigate replace to={RouteUrls.RequestDiagnostics} />} />
        </Route>
      )
    );

  const settingsModalRoutes = (
    <Route>
      <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
      <Route path={RouteUrls.ChangeTheme} element={<ThemesDrawer />} />
      <Route path={RouteUrls.SelectNetwork} element={<SelectNetwork />} />
    </Route>
  );

  return createHashRouter(
    createRoutesFromElements(
      <Route path={RouteUrls.Container} element={<Container />}>
        <Route
          path={RouteUrls.RequestDiagnostics}
          element={
            <>
              lksjdflksjdlfkjs
              <AllowDiagnosticsPage />
            </>
          }
        />

        <Route
          path={RouteUrls.Home}
          element={
            <AccountGate>
              <Home />
            </AccountGate>
          }
        >
          <Route path={RouteUrls.RetriveTaprootFunds} element={<RetrieveTaprootToNativeSegwit />} />

          <Route path={RouteUrls.IncreaseFee} element={<IncreaseFeeDrawer />}>
            {ledgerTxSigningRoutes}
          </Route>
          <Route path={RouteUrls.Receive} element={<ReceiveModal />} />
          <Route path={RouteUrls.ReceiveCollectible} element={<ReceiveCollectibleModal />} />
          <Route
            path={RouteUrls.ReceiveCollectibleOrdinal}
            element={<ReceiveCollectibleOrdinal />}
          />
          <Route path={RouteUrls.ReceiveStx} element={<ReceiveStxModal />} />
          <Route path={RouteUrls.ReceiveBtc} element={<ReceiveBtcModal />} />

          <Route path={RouteUrls.SendOrdinalInscription} element={<SendInscriptionContainer />}>
            <Route index element={<SendInscriptionForm />} />
            <Route
              path={RouteUrls.SendOrdinalInscriptionChooseFee}
              element={<SendInscriptionChooseFee />}
            />
            <Route
              path={RouteUrls.SendOrdinalInscriptionReview}
              element={<SendInscriptionReview />}
            />
            <Route
              path={RouteUrls.SendOrdinalInscriptionSent}
              element={<SendInscriptionSummary />}
            />
            <Route path={RouteUrls.SendOrdinalInscriptionError} element={<BroadcastError />} />
          </Route>

          {settingsModalRoutes}
          {ledgerTxSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.Onboarding}
          element={
            <OnboardingGate>
              <WelcomePage />
            </OnboardingGate>
          }
        >
          {ledgerRequestKeysRoutes}
        </Route>
        <Route
          path={RouteUrls.BackUpSecretKey}
          element={
            <OnboardingGate>
              <BackUpSecretKeyPage />
            </OnboardingGate>
          }
        />
        <Route
          path={RouteUrls.SetPassword}
          lazy={async () => {
            const { SetPasswordRoute } = await import(
              '@app/pages/onboarding/set-password/set-password'
            );
            return { Component: SetPasswordRoute };
          }}
        />

        <Route
          path={RouteUrls.SignIn}
          element={
            <OnboardingGate>
              <SignIn />
            </OnboardingGate>
          }
        />
        <Route path={RouteUrls.MagicRecoveryCode} element={<MagicRecoveryCode />} />
        <Route
          path={RouteUrls.AddNetwork}
          element={
            <AccountGate>
              <AddNetwork />
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ChooseAccount}
          element={
            <AccountGate>
              <ChooseAccount />
            </AccountGate>
          }
        >
          {ledgerJwtSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.Fund}
          element={
            <AccountGate>
              <Suspense fallback={<></>}>
                <FundPage />
              </Suspense>
            </AccountGate>
          }
        >
          <Route path={RouteUrls.FundReceive} element={<ReceiveModal />} />
          <Route path={RouteUrls.FundReceiveStx} element={<ReceiveStxModal />} />
          <Route path={RouteUrls.FundReceiveBtc} element={<ReceiveBtcModal />} />
          {settingsModalRoutes}
        </Route>

        {sendCryptoAssetFormRoutes}

        <Route
          path={RouteUrls.TransactionRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <TransactionRequest />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerTxSigningRoutes}
          <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />
          <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
        </Route>
        <Route path={RouteUrls.UnauthorizedRequest} element={<UnauthorizedRequest />} />

        <Route
          path={RouteUrls.SignatureRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <StacksMessageSigningRequest />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerMessageSigningRoutes}
        </Route>

        <Route
          path={RouteUrls.ProfileUpdateRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <ProfileUpdateRequest />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.PsbtRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <PsbtRequest />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ViewSecretKey}
          element={
            <AccountGate>
              <ViewSecretKey />
            </AccountGate>
          }
        >
          {settingsModalRoutes}
        </Route>
        <Route path={RouteUrls.Unlock} element={<Unlock />}>
          {settingsModalRoutes}
        </Route>

        <Route
          path={RouteUrls.RpcGetAddresses}
          element={
            <AccountGate>
              <RpcGetAddresses />
            </AccountGate>
          }
        />
        {rpcSendTransferRoutes}
        <Route
          path={RouteUrls.RpcSignBip322Message}
          lazy={async () => {
            const { RpcSignBip322MessageRoute } = await import(
              '@app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message'
            );
            return { Component: RpcSignBip322MessageRoute };
          }}
        />

        {/* Catch-all route redirects to onboarding */}
        <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
      </Route>
    )
  );
}
